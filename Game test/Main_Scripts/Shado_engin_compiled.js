/***
*
*
* Shado engin all in 1 JavaScript file
*
*
*/

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

function animate()	{
	animationRequest = requestAnimationFrame(animate);
	c.clearRect(clear.x1, clear.y1, clear.x2, clear.y2);

	// use function render() and put every animated object inside
	render();

	//frameCount++;
}
animate();

function stopAnimation() {
     window.cancelAnimationFrame(animationRequest);
}

function resumeAnimation()	{
	animationRequest = requestAnimationFrame(animate);
}

function stopClear()	{
	clear.x2 = 0;
	clear.y2 = 0;
}

function resumeClear(endX, endY)	{
	if (endX == undefined)	{
		endX = canvas.width;
	}
	if (endY == undefined)	{
		endY = canvas.height;
	}
	clear.x2 = endX;
	clear.y2 = endY;
}
/*
To use animationHandler.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 28/11/2018 6:42:55 PM all rights reserved
*/


// Mouse data
let mouse = {
	x: undefined,
	y: undefined
}

let lastClick = {
	x: undefined,
	y: undefined
}

let lastRightClick = {
	x: undefined,
	y: undefined
}

let clicked = undefined;
let mouseMoved = undefined;
let rightClicked = undefined;
let resized = undefined;


window.addEventListener("mousemove", (event) =>	{
	mouse.x = event.x;
	mouse.y = event.y;

	if (mouseMoved != undefined)	{
		mouseMoved();
	}

});

window.addEventListener("click", (event) =>	{
	lastClick.x = event.x;
	lastClick.y = event.y;

	if (clicked != undefined)	{
		clicked();
	}
});

window.addEventListener("contextmenu", (event) =>	{
	lastRightClick.x = event.x;
	lastRightClick.y = event.y;

	if (rightClicked != undefined)	{
		rightClicked();
	}
});

window.addEventListener("resize", () =>	{
	/*windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;*/

	if (resized != undefined)	{
		resized();
	}
});
/*
	• The getFrameRate function calculates a canvas avrage framerate.
	• The getFrameRate function returns an double.
	• The getFrameRate function requires 2 global variables:
		1. time1 = performance.now();
		2. fpsArray = [];
	These variables should not be changed.
*/

let time1 = performance.now();
let fpsArray = [];

function getFrameRate()	{

	// Avrage function for calculating avrage framerate
	const avrage = (array) =>	{
		return array.reduce((a, b) => a + b) / array.length;
	}

	 let fps = Math.floor(1 / ((performance.now() - time1) / 1000));
	 fpsArray.push(fps);

	 time1 = performance.now();

	 if (fpsArray.length > 500)	{
		fpsArray.splice(0, fpsArray.length / 2);
	 }

	 return avrage(fpsArray);
}

/*let frameCount = 0;
let time = 0;
let framerate = 0;
let fps = 0;

setInterval(function()	{
	time++;
	framerate = frameCount / time;
	fps = framerate;
}, 1000);*/
/*
	• The loading function animates a given string.
	• The loading function does not return a value.
	• The loading function requires at least 2 arguments:
			@para#1	MANDATORY	=> string		: expects a string (without the 3 dots at the end).
			@para#2 MANDATORY	=> id			: expects an HTML element id where this function will animate.
			@para#3	OPTIONAL	=> refreshRate	: expects a number that will determine the animation speed of the given string.

	EXAMPLE:
		HTML:
			<div id="body"></div>
		JS:
			loading("Loading", "body", 1)

	RESULT:
		At 1 second	:	Loading...
		At 2 second	:	Loading..
		At 3 second	:	Loading.
		At 4 second	:	Loading...
		At 5 second	:	Loading..
		At 6 second	:	Loading.

		[...]
*/

function loading(string, id, refreshRate)	{

	if (refreshRate == undefined)	{
		refreshRate = 1;
	}

	let str = `${string}...`;
	let len = str.length;
	str = str.split("");

	setInterval(() =>	{
		str.pop();

		if (str.length < len - 3)	{
			str = `${string}...`;
			len = str.length;
			str = str.split("");
		}

		document.getElementById(id).innerHTML = str.join("");

	}, refreshRate * 1000);
}
/*
To use animationHandler.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 28/11/2018 6:43:43 PM all rights reserved
*/

//const floor = (value) => Math.floor(value);

const random = (min, max, floor) => {
	if (max == undefined)	{
		return Math.random() * min;
	}
	if (floor)	{
		return Math.floor(Math.random() * (max - min) + min);
	} else	{
		return Math.random() * (max - min) + min;
	}
}
const distance = (x1, y1, x2, y2) =>	{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const factorial = (number) =>	{
	let sum = 1;
	if (number != 0 )	{
		do {
			sum = sum * number;
			number -= 1;
		} while (number > 0);
	}
	return sum;
}

/*const randomColor = (alpha) =>	{
	if (alpha == undefined || alpha == "")	{
		alpha = 1;
	}
	let color = `rgba(${random(0, 256, true)}, ${random(0, 256, true)}, ${random(0, 256, true)}, ${alpha})`;
	return color;
}*/


// Vector methods
const sumVector = (vectorA, vectorB, color) => {
	let result =  new Vector(vectorA.startX, vectorA.startY, vectorA.endX + (vectorB.endX - vectorB.startX), vectorA.endY + (vectorB.endY - vectorB.startY), color);
	return result;
}

const dotProduct = (vectorA, vectorB) =>	{
	let result = (vectorA.endX - vectorA.startX) * (vectorB.endX - vectorB.startX) + (vectorA.endY - vectorA.startY) * (vectorB.endY - vectorB.endY);
	return result;
}

const multiplyVector = (vector, k, color) => {
	return new Vector(vector.startX, vector.startY, vector.endX * k, vector.endY * k, color);
}
/*
copyright Shado Entertainment Co. 28/11/2018 6:31:45 PM all rights reserved

This file regroups all classes in Shado Game Engin

NOTE: To use objects.js use "c" as you canvas context variable

History:
11-01-2019 8:47 PM	* Fixed bug where image.clicked() wasn't working
					* Fixed bug where image.hover() wasn't working
					* NEW: Added feature where you can change Image(args[]) source (image.src) after initializing it

*/

class Circle	{
	constructor(x, y, r, styles)	{
		this.x = x;
		this.y = y;
		this.r = r;

		if (!styles)	{
			styles = {
				stroke: "",
				fill: "",
				lineWidth: 0
			};
		}
		
		this.stroke = styles.stroke;
		this.fill = styles.fill;
		this.lineWidth = styles.lineWidth;
	}

	draw()	{
		c.beginPath();
		c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		c.fillStyle = this.fill;
		c.strokeStyle = this.stroke;
		c.lineWidth = this.lineWidth;
		c.fill();
		c.stroke();
	}

	hover()	{
		let d = new Vector(this.x, this.y, mouse.x, mouse.y, "black");
		if (d.module <= this.r)	{
			return true;
		}
	}

	clicked()	{
		let d = new Vector(this.x, this.y, lastClick.x, lastClick.y, "black");
		if (d.module <= this.r)	{
			return true;
		}
	}

	get area()	{
		return Math.PI * Math.pow(this.r, 2);
	}
}

class Smoke	{
	constructor(posX, posY, width, height, dencity, color)	{
		this.x = posX;
		this.y = posY;
		this.w = width;
		this.h = height;
		this.dencity = dencity;
		this.array = [];
		this.color = color;

		if (this.color == undefined || this.color == "")	{
			this.color = "rgb(255, 255, 255, 0.1)";
		}
	}

	draw()	{
		for (let i = 0; i < this.dencity; i++)	{
			if (this.array.length > this.dencity)	{
				break;
			}
			this.array.push(new Circle(random(this.x, this.x + this.w), random(this.y, this.y + this.h), random(0, 20), [this.color, this.color, 1]));
		}

		let liberty = {
			x: this.w / 4,
			y: this.h / 2
		}

		for (let i in this.array)	{
			this.array[i].x = this.array[i].x + random(-1, 1);
			this.array[i].y = this.array[i].y + random(-1, 1);

			if (this.array[i].x - this.array[i].r + liberty.x < this.x)	{
				this.array[i].x = this.array[i].x + 5;
			}
			if (this.array[i].x + this.array[i].r - liberty.x > this.x + this.w)	{
				this.array[i].x = this.array[i].x - 5;
			}
			if (this.array[i].y - this.array[i].r + liberty.y < this.y)	{
				this.array[i].y = this.array[i].y + 5;
			}
			if (this.array[i].y + this.array[i].r - liberty.y > this.y + this.h)	{
				this.array[i].y = this.array[i].y - 5;
			}

			this.array[i].draw();
		}
	}
}

class Rectangle	{
	constructor(x, y, w, h, styles)	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		if (!styles)	{
			styles = {
				stroke: "",
				fill: "",
				lineWidth: 0
			};
		}
		this.stroke = styles.stroke;
		this.fill = styles.fill;
		this.lineWidth = styles.lineWidth;
	}

	draw()	{
		c.beginPath();
		c.rect(this.x, this.y, this.w, this.h);
		c.fillStyle = this.fill;
		c.strokeStyle = this.stroke;
		c.lineWidth = this.lineWidth;
		c.fill();
		c.stroke();
		
	}

	move(dx, dy)	{
		this.dx = dx;
		this.dy = dy;

		this.x += this.dx;
		this.y += this.dy;
	}

	hover()	{
		// is mouse to right of the left-side of the rectangle
		// is mouse to left of the right-side of the rectangle
		// is mouse below the top of the rectangle
		// is mouse above the bottom of the rectangle
		if (mouse.x > this.x && mouse.x < (this.x + this.w) && mouse.y > this.y && mouse.y < (this.y + this.h))	{
			return true;
		}
	}

	clicked()	{
		if (lastClick.x > this.x && lastClick.x < (this.x + this.w) && lastClick.y > this.y && lastClick.y < (this.y + this.h))	{
			return true;
		}
	}

	get area()	{
		return this.w * this.h;
	}
}

class Vector	{
	constructor(startX, startY, endX, endY, color)	{
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.color = color;
	}

	draw()	{
		c.beginPath();
		c.moveTo(this.startX, this.startY);
		c.lineTo(this.endX, this.endY);
		c.strokeStyle = this.color;
		c.stroke();

		let point = new Circle(this.endX, this.endY, 4, [this.color, this.color, 1]);
		point.draw();
	}

	get module()	{
		return distance(this.startX, this.startY, this.endX, this.endY);
	}
}

class Text	{
	constructor(content, x, y, styles)	{
		this.content = content;
		this.x = x;
		this.y = y;

		this.size = styles.size;
		this.font = styles.font;
		this.fill = styles.fill;
	}

	draw()	{
			c.beginPath();
			c.font = `${this.size}px ${this.font}`;
			c.fillStyle = this.fill;
			c.fillText(this.content, this.x, this.y);
	}

	hover()	{
		if (mouse.x > this.x && mouse.x < (this.x + this.width) && mouse.y < this.y && mouse.y > (this.y - this.height))	{
			return true;
		}
	}

	clicked()	{
		if (lastClick.x > this.x && lastClick.x < (this.x + this.width) && lastClick.y < this.y && lastClick.y > (this.y - this.height))	{
			return true;
		}
	}

	get width()	{
		c.font = `${this.size}px ${this.font}`;
		return c.measureText(this.content).width;
	}

	get height()	{
		return this.size - this.size / 5;
	}
}

class Image	{
	constructor(src, x, y, w, h)	{
		this.src = src;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = `img${random(0, 99999, true)}`;

		let body = document.querySelector("body");
		let img = document.createElement("img");
		img.setAttribute("id", this.id);
		img.setAttribute("src", this.src);
		img.setAttribute("style", "display: none");
		body.appendChild(img);
		
		this.tempRect = new Rectangle(this.x, this.y, this.w, this.h);
	}

	draw()	{
		let image = document.getElementById(this.id);
		image.src = this.src;

		c.drawImage(image, this.x, this.y, this.w, this.h);
	}
	
	hover()	{
		/*if (mouse.x > this.x && mouse.x < (this.x + this.width) && mouse.y < this.y && mouse.y > (this.y - this.height))	{
			return true;
		}*/
		
		if (this.tempRect.hover())	{
			return true;
		} else	{
			return false;
		}
	}
	
	clicked()	{
		/*if (lastClick.x > this.x && lastClick.x < (this.x + this.width) && lastClick.y < this.y && lastClick.y > (this.y - this.height))	{
			return true;
		}*/
		
		if (this.tempRect.clicked())	{
			return true;
		} else	{
			return false;
		}
		
	}
	
}

class Shape	{
	constructor(vertex, styles)	{
		this.vertex = vertex.split("");

		if (!styles)	{
			styles = ["", "", 0];
		}
		this.stroke = styles[0];
		this.fill = styles[1];
		this.lineWidth = styles[2];

		for (let i in this.vertex)	{
			if (this.vertex[i] == "(" || this.vertex[i] == ")")	{
				this.vertex.splice(i, 1);
			}
		}

		this.vertex = this.vertex.join("");
		this.vertex = this.vertex.split(",");
	}

	draw()	{
		c.beginPath();
		c.moveTo(Number(this.vertex[0]), Number(this.vertex[1]));

		for (let i = 0; i < this.vertex.length - 1; i += 2)	{
			c.lineTo(Number(this.vertex[i]), Number(this.vertex[i + 1]));
		}

		c.strokeStyle = this.stroke;
		c.fillStyle = this.fill;
		c.lineWidth = this.lineWidth;
		c.stroke();
		c.fill();
	}

	get parameter()	{
		let sum = 0;
		for (let i = 0; i < this.vertex.length; i++)	{
			sum += distance(Number(this.vertex[i]), Number(this.vertex[i + 1]), Number(this.vertex[i + 2]), Number(this.vertex[i + 3]));
			console.log(distance);
		}

		return sum;
	}
}

class Point	{
	constructor(x, y)	{
		this.x = x;
		this.y = y;
	}

	draw()	{
		c.beginPath();
		c.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
		c.fill();
	}
}
// Shado javascript framework v2.0.0
let version = " v2.0.0";
let releaseDate = "06/11/2018 4:30:55 PM";
let Pi = Math.PI;
//let π = Math.PI;
let angles;
let e = Math.E;
let copyRight = `&copy; Shado JS framework ${version} | All rights reserved 28/01/2018 5:20 PM 10002801201817247_745`;
let path = window.location.pathname;
let filename = path.split("/").pop();

const randomBetweenRange = (min, max, floor)	=>	{
	if (floor)	{
		return Math.floor(Math.random() * (max - min) + min);
	} else	{
		return Math.random() * (max - min) + min;
	}
}

const root = (num, power) =>	{
     if ( (power == null) || (power == " ") || (power == "") ) {
          power = 2;
     }
     if ( (num < 0) && (power % 2 == 0) )    {
          return Math.pow(Math.abs(num), 1 / power) + "i";
     } else {
          return Math.pow(num, 1 / power);
     }
}

const radianToDegrees = (rad)	=> (rad * 180) / Math.PI;

const degreesToRadians = (deg) =>	(deg * Math.PI) / 180;

const write = (elementId, argument)	=>	document.getElementById(elementId).innerHTML = argument;

const exp = (base, exposant) => Math.pow(base, exposant);

const square = (base) => Math.pow(base, 2);

const sin = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.sin(ang);
}

const cos = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.cos(ang);
}

const tan = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.tan(ang);
}

const sec = (ang) => (1 / cos(ang));
const csc = (ang) => (1 / sin(ang));
const cot = (ang) => (1 / tan(ang));

const arcsin = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.asin(arg));
     } else {
          return Math.asin(arg);
     }
}

const arccos = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.acos(arg));
     } else {
          return Math.acos(arg);
     }
}

const arctan = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.atan(arg));
     } else {
          return Math.atan(arg);
     }
}

const log = (base, number) =>	{
	if ( (base == null) || (base == "") )	{
		base = 10;
	}
	return Math.log(number) / Math.log(base);
}

const ln = (number)	=>	log(Math.E, number);

const getElement = (id) =>	document.getElementById(id);

const zeros = (a, b, c, i) =>	{
	var zerosArray = [
		(-b + (Math.sqrt(Math.pow(b, 2) - (4 * a * c)))) / (2 * a),
		(-b - (Math.sqrt(Math.pow(b, 2) - (4 * a * c)))) / (2 * a)
	];
	if (i == null)	{
		return zerosArray;
	} else	{
		return zerosArray[i];
	}
}

const round = (argument, digits) =>	argument.toFixed(digits);

const randomColor = (alpha)	=> {
	if (alpha == undefined || alpha == "")	{
		alpha = 1;
	}
	let color = {
		r: round(randomBetweenRange(0, 255)),
		g: round(randomBetweenRange(0, 255)),
		b: round(randomBetweenRange(0, 255))
	};
	var rgb = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
	return rgb;
}

const primeNumber = (number) =>	{
	let cond;
	let conditionNumber = 0;

	for (let i = 0; i <= 9; i++)	{
		if (number % i != 0)	{
			conditionNumber = conditionNumber;
		} else	if (number % i == 0)	{
			conditionNumber += 1;
		}
	}

	if (conditionNumber > 2)	{
		cond = false;
	} else	{
		cond = true;
	}
	return cond;
}

const detect = (string, character)  =>	{
  let stringArray = string.split("");
  numberOfCharacters = 0;

  for (let i = 0; i < stringArray.length; i++)  {
    if (stringArray[i] == character)  {
      numberOfCharacters += 1;
    }
  }
  return numberOfCharacters;
}

const sum = (array) =>	{
	let addtion = 0;
	for (let i = 0; i < array.length; i++)	{
		addtion += array[i];
	}
	return addtion;
}

const floor = (value) => Math.floor(value);

const removeElement = (arrayname, elem) =>	{
	for (let i = arrayname.length - 1; i < 0; i--)	{
		if (arrayname[i] == elem)	{
			arrayname.splice(1, i);
		}
	}
}

const copy = (argument) => {
	let copyText = document.getElementById(argument);
	copyText.select();
	return document.execCommand("Copy");
}

const compare = (array) =>	{
     var number = 0;

     for (let i = 0; i < array.length; i++)    {
          if (array[i] > number) {
               number = array[i];
          }
     }
     return number;
}

const generatePassword = (digits) =>	{
	if (digits == undefined)	{
		digits = 16;
	}

	let password = "";
	let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890[],.;/!?%$#@*&()";
	char = char.split("");

	for (let i = 0; i < digits; i++)	{
		password += char[randomBetweenRange(0, char.length, true)];
	}

	return password;
}

const errorCatcher = (callback) =>	{
	try	{
		callback();
	} catch(error)	{
		console.log(error);
	}
}
console.log(copyRight);
