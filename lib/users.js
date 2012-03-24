
global.User = function(name, password)
{
	this.name = name;
	this.password = password;
	this.email = "";
	this.phone = "";
	this.address = "";
	this.foto = "";
	this.roles = "";
};

User.prototype.isValid = function()
{
	return (this.password != undefined && this.name != undefined &&
		this.password.length >= 4 && this.name.length >= 4);
}

User.prototype.hasRole = function(role)
{
	return true;
}

User.find = function(name, password)
{console.log(name);
	if (password == "") return null;
	return new User(name, password);
}

User.prototype.save = function()
{
	
}

app.all('/register', function(req, res){
	
	var user = new User("", "");
	for (i in req.body) user[i] = req.body[i];
	
	if (req.body.password != req.body.password2 || !user.isValid())
	{
		if (req.param('partial') != undefined){
			res.partial('register', { locals: {params: params, user: user } });
		}else{
			res.render('register', { locals: {params: params, user: user } });
		}
	}else{
		req.session.user = user;
		res.redirect(req.body.redir ? req.body.redir : "/");
	}
});

app.all('/login', function(req, res){
	var user = User.find(req.body.name, req.body.password);
	if (user == null)
	{
		res.render('login', { locals: {params: params, redir: req.query.redir } });
	}else{
		req.session.user = user;
		res.redirect(req.body.redir ? req.body.redir : "/");
	}
});

global.login = function(req, res, next){
	if(req.session.user)
	{
		next();
	}else{
		res.redirect('/login?redir=' + req.url);
	}
}