/*
To use shad_game_engin.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 06/11/2018 5:16:48 PM all rights reserved
*/

let canvasWidth;
let canvasHeight;

let canvas;
let c;

// Main function: Creating canvas
function createCanvas(width, height, styles)	{
	document.querySelector("body").innerHTML = '<canvas id="engin"></canvas>' + document.querySelector("body").innerHTML;

	canvas = document.getElementById("engin");
	canvas.width = width;
	canvas.height = height;

	if (!styles)	{
		styles = ["", "", 0];
	}
	canvas.style.background  = styles[1];
	canvas.style.border  = `solid ${styles[0]} ${styles[2]}px`;
	c = canvas.getContext("2d");

	if (canvas.width >= window.innerWidth && canvas.height >= window.innerHeight)	{
		document.querySelector("body").style.margin = "0";
	}
}


// Mouse date
let mouse = {
	x: undefined,
	y: undefined
}

let lastClick = {
	x: undefined,
	y: undefined
}

window.addEventListener("mousemove", (event) =>	{
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener("click", (event) =>	{
	lastClick.x = event.x;
	lastClick.y = event.y;
})


// Math methods
const floor = (value) => Math.floor(value);
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

const randomColor = (alpha) =>	{
	if (alpha == undefined || alpha == "")	{
		alpha = 1;
	}
	let color = `rgba(${random(0, 256, true)}, ${random(0, 256, true)}, ${random(0, 256, true)}, ${alpha})`;
	return color;
}


// ObjectS
class Circle	{
	constructor(x, y, r, styles)	{
		this.x = x;
		this.y = y;
		this.r = r;

		if (!styles)	{
			styles = ["", "", 0];
		}
		this.stroke = styles[0];
		this.fill = styles[1];
		this.lineWidth = styles[2];
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
			styles = ["", "", 0];
		}
		this.stroke = styles[0]
		this.fill = styles[1];
		this.lineWidth = styles[2];
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

		if (!styles)	{
			styles = ["", "", 0];
		}
		this.size = styles[1];
		this.font = styles[2];
		this.fill = styles[0];
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
	}

	draw()	{
		let image = document.getElementById(this.id);

		c.drawImage(image, this.x, this.y, this.w, this.h);
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

/*class Point	{
	constructor(x, y, color)	{
		this.x = x;
		this.y = y;
		this.fill = color;
	}

	draw()	{
		c.beginPath();
		c.fillStyle = this.fill;
		c.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
		c.fill();
	}
}*/


// Vector methods
const sumVector = (vectorA, vectorB, color) => {
	let result =  new Vector(vectorA.startX, vectorA.startY, vectorA.endX + (vectorB.endX - vectorB.startX), vectorA.endY + (vectorB.endY - vectorB.startY), color);
	return result;
}

const produitScalaire = (vectorA, vectorB, color) =>	{
	let result = (vectorA.endX - vectorA.startX) * (vectorB.endX - vectorB.startX) + (vectorA.endY - vectorA.startY) * (vectorB.endY - vectorB.endY);
	return result;
}

const multiplyVector = (vector, k, color) => {
	return new Vector(vector.startX, vector.startY, vector.endX * k, vector.endY * k, color);
}


// Animation handling
function animate()	{
	requestAnimationFrame(animate);
	//c.clearRect(0, 0, canvas.width, canvas.height);

	// use function render() and put every animated object inside
	render();
}

animate();
