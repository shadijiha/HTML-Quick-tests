/*
To use animationHandler.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 28/11/2018 6:42:30 PM all rights reserved
*/

let width;
let height;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let canvas;
let c;
let clear = {};

// Main function: Creating canvas
function createCanvas(width, height, styles)	{
	document.querySelector("body").innerHTML = '<canvas id="engin"></canvas>' + document.querySelector("body").innerHTML;

	canvas = document.getElementById("engin");
	canvas.width = width;
	canvas.height = height;

	if (!styles)	{
		styles = {
			background: "transparent",
			border: "transparent",
			borderWidth: 0
		};
	}
	canvas.style.background  = styles.background;
	canvas.style.border  = `solid ${styles.border} ${styles.borderWidth}px`;
	c = canvas.getContext("2d");

	if (canvas.width >= window.innerWidth && canvas.height >= window.innerHeight)	{
		document.querySelector("body").style.margin = "0";
	}

     width = canvas.width;
     height = canvas.height;

	clear = {
		x1: 0,
		y1: 0,
		x2: canvas.width,
		y2: canvas.height
	};
}


// Animation handling

let animationRequest;
const MAXFPS = 60;

function animate()	{
	//animationRequest = requestAnimationFrame(animate);
	//c.clearRect(clear.x1, clear.y1, clear.x2, clear.y2);
	
	// use function render() and put every animated object inside	
	//render();

	//frameCount++;
}
//animate();

animationRequest = setInterval(function()	{
	c.clearRect(clear.x1, clear.y1, clear.x2, clear.y2);
	render();
}, 1000 / MAXFPS);

function stopAnimation() {
    //window.cancelAnimationFrame(animationRequest);
	
	clearInterval(animationRequest);
}

function resumeAnimation()	{
	//animationRequest = requestAnimationFrame(animate);
	setTimeout(function()	{
		
		animationRequest = setInterval(function()	{
			c.clearRect(clear.x1, clear.y1, clear.x2, clear.y2);
			render();
		}, 1000 / MAXFPS);

	}, 100);
}

function stopClear()	{
	clear.x2 = 0;
	clear.y2 = 0;
}

function resumeClear(startX, startY, endX, endY)	{
	if (endX == undefined)	{
		endX = canvas.width;
	}
	if (endY == undefined)	{
		endY = canvas.height;
	}
	clear.x1 = startX;
	clear.y1 = startY;
	clear.x2 = endX;
	clear.y2 = endY;
}
