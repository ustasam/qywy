

var express = require('express');
global.app = express.createServer();

var MongoStore = require('connect-mongo');

global.fs = require('fs');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
	
  app.use(require("stylus").middleware({ src: __dirname + "/public/" }));//
  
  app.use(express.staticCache());
  //app.use(express.static(__dirname + '/public/', { maxAge: 2592000000 }));   
  
  app.use(require('gzippo').staticGzip(__dirname + '/public/', { maxAge: 2592000000 }));
  //app.use(gzippo.compress());
  
  app.use(express.favicon());

  app.use(express.logger('dev'));  

  app.use(express.cookieParser());   
  app.use(express.bodyParser( { uploadDir: __dirname + '/public/uploads/tmp/' } ));
  app.use(express.methodOverride());
  
  global.sessions = new MongoStore( {db: 'qywy_ru', reapInterval: 600000});
  //global.sessions = new express.session.MemoryStore( { reapInterval: 600000} );
  app.use(express.session( {secret: 'suskind', store: sessions } )); 
  
  global.everyone = require("now").initialize(app);   
  
  app.use(app.router);
}); 
 
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
 
app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(9201);
console.log("Server listening on port %d in %s mode", app.address().port, app.settings.env);

app.get('/api/model/:items', function(req, res){
	var result = "";
	var items = req.params.items.split(",");
	for(var i in items)
	{
		if (params.shared.indexOf(items[i]) >= 0)
		{console.log(items[i]);
			result = result + eval(items[i]) + ";\n\n";
			for(j in eval(items[i]).prototype)
			{
				result = result + items[i] + ".prototype." + j + 
						"=" + eval(items[i]).prototype[j] + ";\n\n";
			}	
		}
	}
	res.send(result);
});

require('./lib/tools');
require('./lib/users');
require('./lib/products');
require('./lib/chat');
require('./lib/files');
require('./lib/pages');
