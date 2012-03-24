now.ready(function(){
	if ($("#chat").size() == 0) {
		$.get('/api/chat', function(data) {
			$("body").append(data);
			$( "#chat button" ).button();
			
			$("#chat").dialog({
				autoOpen: false, //true
				show: "blind",
				hide: "explode"
			});
			
		});
		
		now.incoming = function(user, message){
			add(user, message);
		};
	}
});

function add(user, message){
	$( "#chat #messages" ).append("<p><b>" + user + "</b>: " + message + "</p>");
	$( "#chat #messages" ).scrollTop(500);
}

function send(){
	now.message( $( "#chat input, #chat textarea" ).val() );
	add( "Я", $( "#chat input, #chat textarea" ).val() );
	$( "#chat input, #chat textarea" ).val("");	
}