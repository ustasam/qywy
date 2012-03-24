
global.params = { 	title: "Привет!",
					description: "qywy",
					keywords: "qywy",
					include: {
						blueprint: true,				
						jquery: true,
						jqueryui: true,
						//FancyBox:true,
						srcs: [ 'http://qywy.ru:9201/nowjs/now.js', //server:port/nowjs
								'/js/chat.js'
						],
						includes: []
					},
					menu: [
						{title: "Главная", ref: "/", position: 0}
					],
					shared: ["Product", "Category", "Order", "OrderItem"]
			};

var data = {};
var p404 = {"title": "404 не найдено",
            "text": "Страницы не существует. 404",
			"position": 0};
var dataFile = __dirname + "/../" + 'pages.json';	
	
function menu(filter)
{
	var menu = [];
	for (i in data)
	{
		if ((! filter) || filter(data[i]))
			menu.push({title: data[i].title, ref: i, position: data[i].position});
	}
	return menu.sort(function(a, b){return a.position-b.position;});
}
	
function updateMenu()
{
	params.menu = menu(function(i){ return i.position > 0;});
}
	
function load(){
	t = fs.readFileSync(dataFile);
	data = JSON.parse(t);
	updateMenu();
}

load();

app.post('/update', login, function(req, res){
	if (req.body.index)
	{
		data[req.body.index] = req.body;
		delete data[req.body.index]["index"];
		fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err){
			if (!err) {
				res.send('ok');
			}else 
				res.send('false');
			updateMenu();
		});
	}else{ res.send('false'); }
});

app.get('/delete/:id', login, function(req, res){
	delete data[req.params.id];
	console.log(req.params.id);
	fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err){
		if (!err) {
			res.send('ok');	
		}else 
			res.send('false');
		updateMenu();	
	});
});

app.get('/edit/:id', login, function(req, res){
	var d = data[req.params.id];
	if (!d) d = {"title": "Новая",
				 "text": "Новая страница.",
				 "position": 0};
	res.render('page_edit', { locals: {params: params, data: d, index: req.params.id} });
});

app.get('/pages', login, function(req, res){
	res.render('pages', { locals: {params: params, pages: menu()}});
});

app.get('/', function(req, res){
	res.render('index', { params: params, data: data[params.menu[0].ref]});
});

app.get(/.+/i, function(req, res){
	var url = decodeURI(req.url.replace(/^\//,""));
	if (url in data)
	{
		d = data[url];
		res.render('index', { locals: {params: params, data: d} });		
	}else{
		res.render('index', { status: 404, locals: {params: params, data: p404} });
	}
});
