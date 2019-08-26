/***
 * 
 *   JavaScript file that all EVENTS of the game
 * 
 */
 	
	// Detect press
	document.onkeydown = function(event)	{
		
		if (event.keyCode == 68)
			socket.emit('keyPress', {inputId: 'right', state: true});
		else if (event.keyCode == 83)
			socket.emit('keyPress', {inputId: 'down', state: true});
		else if (event.keyCode == 65)
			socket.emit('keyPress', {inputId: 'left', state: true});
		else if (event.keyCode == 87)
			socket.emit('keyPress', {inputId: 'up', state: true});
		else if (event.keyCode == 32)
			socket.emit('keyPress', {inputId: 'attack', state: true});
	}
	
	document.onkeyup = function(event)	{
		
		if (event.keyCode == 68)
			socket.emit('keyPress', {inputId: 'right', state: false});
		else if (event.keyCode == 83)
			socket.emit('keyPress', {inputId: 'down', state: false});
		else if (event.keyCode == 65)
			socket.emit('keyPress', {inputId: 'left', state: false});
		else if (event.keyCode == 87)
			socket.emit('keyPress', {inputId: 'up', state: false});
		else if (event.keyCode == 32)
			socket.emit('keyPress', {inputId: 'attack', state: false});
	}

	document.onmousemove = function(event)	{
		var x = -(canvas.width / 2) + event.clientX - 8;
		var y = -(canvas.height / 2) + event.clientY - 8;
		var angle = Math.atan2(y, x) / Math.PI * 180;
		socket.emit('keyPress', {inputId: 'mouseAngle', state: angle});
	}

	function syntaxHighlight(json) {
		if (typeof json != 'string') {
			 json = JSON.stringify(json, undefined, 2);
		}
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'color: orange';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'color: blue';
				} else {
					cls = 'color: green';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span style="' + cls + '">' + match + '</span>';
		});
	}
