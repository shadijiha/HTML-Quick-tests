/*** 
 * 	JavaScript main file for "Tracer recall test" project 
 * 
 * 
 */ 
 

	createCanvas(window.innerWidth, window.innerHeight);

	/* CORE */
	let tracerVoice = [
		 "https://d1u5p3l4wpay3k.cloudfront.net/overwatch_gamepedia/c/c0/Tracer_-_Ever_get_that_feeling_of_d%C3%A9j%C3%A0_vu.ogg",
		 "https://d1u5p3l4wpay3k.cloudfront.net/overwatch_gamepedia/0/01/Tracer_-_Just_in_time.ogg",
		 "https://d1u5p3l4wpay3k.cloudfront.net/overwatch_gamepedia/2/22/Tracer_-_Let%27s_try_that_again.ogg",
		 "https://d1u5p3l4wpay3k.cloudfront.net/overwatch_gamepedia/1/1b/Tracer_-_Now%2C_where_were_we.ogg"
	];

	function playVoiceLine() {
		 document.querySelector("audio").src = tracerVoice[Math.floor(Math.random() * tracerVoice.length)];
		 document.querySelector("audio").play();
	}

	let time = 0;

	let coordenates = {};


	function smoothAnimation(object, endX, endY)    {
		 let animation = setInterval(() =>   {
			  let accelerationX = 10;
			  let accelerationY = 10;

			  if (object.x == endX)     {
				   accelerationX = 0;
			  }
			  if (object.y == endY)     {
				   accelerationY = 0;
			  }
			  if (object.x == endX && object.y == endY)    {
				   clearInterval(animation);
			  }

			  if (object.x > endX)     {
				   object.x -= accelerationX;
			  }
			  if (object.x < endX)     {
				   object.x += accelerationX;
			  }
			  if (object.y > endY)     {
				   object.y -= accelerationY;
			  }
			  if (object.y < endY)     {
				   object.y += accelerationY;
			  }
		 }, 10);
	}

	setInterval(() =>   {
		 time++;
		 coordenates[time] = {
			  x: tracer.x,
			  y: tracer.y
		 }
	}, 10);

	let tracer = new Rectangle(100, 100, 150, 150);
	let image = new Image("../tracer.png", 100, 100, 150, 150);
	let imageE = new Image("../tracer.png", 100, 100, 150, 150);
	let display = new Text(time / 100, 50, 50, {size: 36, font: "Arial", fill: "black"});

	let speed = 10;


	window.onkeydown = function(event) {
		 switch(event.keyCode) {
			  case 87:
				   tracer.y -= speed;
				   break;
			  case 83:
				   tracer.y += speed;
				   break;
			  case 65:
				   tracer.x -= speed;
				   break;
			  case 68:
				   tracer.x += speed;
				   break;
			  case 69:
				   //tracer.x = coordenates[time - 300].x;
				   //tracer.y = coordenates[time - 300].y;
				   smoothAnimation(tracer, coordenates[time - 300].x, coordenates[time - 300].y);
				   coordenates = {};
				   playVoiceLine();
				   break;
		 }
	}


	function showTrace(object)    {
		 c.beginPath();
		 c.moveTo(coordenates[time - 300].x + (object.w / 2), coordenates[time - 300].y + (object.h / 2));
		 for (let i = 300; i >= 0; i--)   {
			  c.lineTo(coordenates[time - i].x + (object.w / 2), coordenates[time - i].y + (object.h / 2));
		 }
		 c.stroke();

		 imageE.x = coordenates[time - 300].x;
		 imageE.y = coordenates[time - 300].y;
	}

	function render()   {
		 image.x = tracer.x;
		 image.y = tracer.y;
		 image.draw();

		 c.globalAlpha = 0.5;
		 imageE.draw();
		 c.globalAlpha = 1;

		 let display = new Text(time / 100, 50, 50, {size: 36, font: "Arial", fill: "black"});
		 display.draw();

		 showTrace(tracer);
	}