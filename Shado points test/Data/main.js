/*** 
 * 	JavaScript main file for "Shado points test" project 
 * 
 * 
 */ 

	let canvas = document.querySelector("canvas");
	let c = canvas.getContext("2d");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	
	fetch("http://localhost/HTML/HTML%20Quick%20tests/Shado%20points%20test/data.shado")
	.then(response => response.text())
	.then(data => callback(data))
	.catch(err => console.log(err));

	function callback(data)	{
		
		data = data.split("\n");
		data.pop();
		
		c.beginPath();
		c.moveTo(data[0].split(", ")[0], data[0].split(", ")[1]);
		for (let i = 1; i < data.length - 1; i++)	{
			let point = {
				x: data[i].split(", ")[0],
				y: data[i].split(", ")[1],
				prex: data[i - 1].split(", ")[0], // previous x
				prey: data[i - 1].split(", ")[1]  // previous y 
			};
			
			let xDiff = (point.x - point.prex);
			let yDiff = (point.y - point.prey);
			
			c.bezierCurveTo(point.x - xDiff, point.y - yDiff, point.x, point.y - yDiff, point.x, point.y);
			
			//console.log(`(${point.x}, ${point.y})`);
		}
		c.stroke();		
	}