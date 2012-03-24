$(document).ready(function(){
	
	$.getScript('/api/model/Order,OrderItem,Product,Category', function() {
		init();
		order = new Order();
		
		order.render();	
		
		setScanCallback(scanned);
		
		player.init();	

		$.getJSON('/api/products', function(data) {
			categories = data;
			renderItems();
		});
		console.log(order);
	});

});

var categories = [];
var orders = [];		
var order = null;

function init()
{
	Order.prototype.render = function ()
	{
		$("#summ .val").text(Number(this.sum).toFixed(2));			
		$("#paid .val").text(Number(this.paid).toFixed(2));
		$("#change .val").text(Number(this.change()).toFixed(2));

		$.each($(".val"), function(i, v){$(v).text( Number($(v).text()).toFixed(2) )});

		if (this.change() == 0) $("#change .val").text("");
		else if (this.change() < 0) $("#change .val").css("color", "Salmon");
		else $("#change .val").css("color", $("#paid .val").css("color"));
		
		$(".dyn").textfill();		
		
		jQuery('#total tbody').html(jQuery.tmpl('orders', this.items));
	}


	function renderItems(){
		jQuery('#categories').html(jQuery.tmpl('categories', categories));
		jQuery('#products').html(jQuery.tmpl('items', categories));
		$( "button.item" ).button({
			create: function(event, ui) {
				event.target.innerHTML += '<img id="button" src="' 
					+ $(event.target).attr("image") + '"></img>';
			}
		});
		
		$( "button.item, #products .item, #categories .item" ).click(function (){	
			var item = $("#" + this.id).tmplItem().data;
			//if (item.price != undefined){
				order.add(item);
			//}else{
				renderItems(item);
			//}
		});
	}

	function scanned(code){
		console.log("Scanned:" + code);
	}

}