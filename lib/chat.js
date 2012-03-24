everyone.now.message = function(text){
	console.log(text);
	console.log(this.user.session);
	everyone.now.incoming(this.user.session.user, text);
}

app.get('/api/chat', function(req, res){
	res.partial('chat', { params: params });
});