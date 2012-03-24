var player = new function() {
	this.initTrack = function(name, track){
		player[name] = { players:[], current:0, path:""};
		for(var i = 0; i<6; i++)
		{var a= i;	
			$("#jplayer").append('<div id="jplayer' + i + name + '"/>');
			$("#jplayer" + i + name).jPlayer({ 
				ready: function () {
					$(this).jPlayer('setMedia', { mp3: '/audio/' + track});
				},
				swfPath:"/jPlayer/Jplayer.swf"
			});
			player[name].players.push($("#jplayer" + i + name));
			player[name].path = '/audio/' + track;
		}
	};
	this.init = function()
	{
		$("body").append('<div id="jplayer"/>');
		this.initTrack("click", "pocketKnife2.mp3");			
		this.initTrack("error", "Windows Critical Stop.mp3");
		this.initTrack("scanned", "Speech On.mp3");
	};
	this.play = function(name)
	{
		var p = player[name].players[player[name].current];
		p.jPlayer('setMedia', { mp3: "/audio/Speech On.mp3"});
		p.jPlayer('play');
		player[name].current = player[name].current >= 5 ? 0 : player[name].current + 1;
	}
}