global.OrderItem = function OrderItem(product, amount)
{
	this.product = product;	
	this.amount = amount == undefined ? 1 : amount;
	this.paid = 0;
}
OrderItem.prototype.sum = function() { return this.amount * this.product.price; }
OrderItem.prototype.setAmount = function(amount) { this.amount = amount; this.calc(); }

global.Order = function Order()
{
	this.items = [];	
	this.sum = 0;
	this.paid = 0;
}
Order.prototype.change = function() { return this.paid - this.sum; }

Order.prototype.recalc = function() { 
	this.sum = 0;
	for (var i = 0;i < this.items.length; i++) this.sum = this.sum + this.items[i].sum();
	return this.sum; 
}

Order.prototype.position = function(product) {
	var res = -1;
	for (var i = 0;i < this.items.length; i++){
		if ( this.items[i].product == item ) { res = i; break; }
	};	
	return res;//-1
}

Order.prototype.add = function(product, amount)
{	product.price = 10;////to delete
	amount = amount == undefined ? 1 : amount;
	var pos = this.position(product);
	if ( pos == -1 ){
		this.items.push( new OrderItem(product, amount) );
		pos = this.items.length - 1;
	}else{
		this.items[pos].amount = this.items[pos].amount + amount;
		if (amount == 0) this.items[pos].amount = 0;
	}
	if (this.items[pos].amount <= 0)
	{
		this.items.splice(pos, 1);
	}
	this.recalc();
	this.render();
}

//-----------------------------------------------------------------------------------

global.Category = function Category(id, name)
{
	this.id = id;
	this.name = name;
	this.categoryes = [];
	this.products = [];
	this.image = "http://www.oladki.ru/wp-content/uploads/2011/03/39-275x300.jpg";
};

global.Product = function Product(id, name)
{
	this.id = id;
	this.name = name;
	this.category = "";
	this.price = 0;
	this.image = "http://www.oladki.ru/wp-content/uploads/2011/03/39-275x300.jpg";
};

app.get('/terminal', login, function(req, res){
	res.partial('cart/terminal', { params: params });
});

app.get('/products', login, function(req, res){
	res.partial('cart/products', { params: params });
});

app.get('/api/products', login, function(req, res){
	
	var result = [ new Category(4, 'ботинки'), 
				   new Category(6, 'носки')]
	
	res.send(JSON.stringify(result));
	
});

