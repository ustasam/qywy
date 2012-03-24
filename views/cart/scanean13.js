function checkEAN13(code){  
	//3 страна, 4 изготовитель, 5 товар, 1 контроль
	code = ''+code;
	var cs = 0;
	for(var i=0; i<12; i++)
	{  
		var digit = Number(code.charAt(i));
		cs = cs + digit * ( ((i % 2) == 0) ? 1 : 3);
	}
	cs = cs % 10;
	if (cs > 0) cs = 10 - cs
	return (cs == Number(code.charAt(13 - 1))) && code.length == 13;
}

var scan = { code: "", times: [] }
function scancode(event){
	var enableKeyCode = false; //config var
	
	var n = String.fromCharCode(event.charCode);
	if (n < "0" || n > "9") {scan.code = ""; scan.times = []; return;}
	var timeStamp = event.timeStamp;
	while ((scan.times.length > 0) && (timeStamp - scan.times[0] > 1500))//1.5sec
	{
		scan.times = scan.times.slice(1);
		scan.code = scan.code.substring(1);
	}
	scan.code = scan.code + "" + n;
	scan.times.push(timeStamp);
	while (scan.times.length >= 13 + (enableKeyCode ? 1 : 0)){ //> to keyCode scanning
		var current = scan.code.substring(0, 13);
		if (!enableKeyCode && checkEAN13(current))
		{
			player.play("scanned");
			scanned(current);//Scanned
			scan.times = scan.times.slice(13);
			scan.code = scan.code.substring(13);
		}
		scan.times = scan.times.slice(1);
		scan.code = scan.code.substring(1);
	}
}

function scankey(event){
	if ($.inArray(event.keyCode, [02, 03, 13, 10, 09, 32]) > -1) //STX, ETX, CR, NL, HT, Space
	{
		if (scan.code.length >= 13)
		{
			var current = scan.code.substring(scan.code.length - 13);// (0, 13)
			console.log("cur" + current);
			if (checkEAN13(current))
			{
				player.play("scanned");
				scanned(current);//Scanned
			}else{
				player.play("error");
			}
		}
		scan.code = ""; scan.times = [];
	}
}

var scan_callback = null;

function scanned(code){
	if (scan_callback != null) scan_callback(code);
}

function setScanCallback(f){
	scan_callback = f;
	
	$(window).keypress(scancode);
	$(window).keydown(scankey);
}