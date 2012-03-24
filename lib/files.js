var path = __dirname + '/../public/uploads/';
var webpath = '/uploads/';

app.get('/files', login, function(req, res){
	fs.readdir(path, function(err, files){
		var result = [];
		var j = 0; for(i in files){
			fs.stat(path + files[i], function(err, stats) {
				//console.log(stats);
				if (stats.isFile()) result.push(files[j]);
				j++;if (j == files.length)
				{
					res.render('files', { locals: {params: params, files: result }} );				
				}
			});
		}
	});
});

app.post('/upload', login, function(req, res){
    console.log(req.files);
	var result = [];
	var j = 0; for(i in req.files.files)
	{
		//console.log(req.files.files[i].path, path + req.files.files[i].name);
		fs.rename(req.files.files[i].path, path + req.files.files[i].name,
		  function(err){
			if (err) throw err;
			result.push(webpath + req.files.files[j].name);
			j++;if (j == req.files.files.length)
			{
				res.send(JSON.stringify(result));
			}
		});
	}
});

app.get('/deleteFile/:id', login, function(req, res){
	console.log(path + req.params.id);
	fs.unlink(path + req.params.id, function(err){
		if (!err) {
			res.send('ok');	
		}else 
			res.send('false');
	});
});
