/*
copyright Shado Entertainment Co. 28/11/2018 6:31:45 PM all rights reserved

This file regroups all classes in Shado Game Engin

NOTE: To use objects.js use "c" as you canvas context variable

History:
11-01-2019 8:47 PM	* Fixed bug where image.clicked() wasn't working
					* Fixed bug where image.hover() wasn't working
					* NEW: Added feature where you can change Image(args[]) source (image.src) after initializing it
					
25-01-2019 10:46 PM * Fixed bug where this.tempRect didn't follow the image in CLASS IMAGE and caused problems with
						hover() and clicked()

*/

class Circle	{
	constructor(x, y, r, styles)	{
		this.x = x;
		this.y = y;
		this.r = r;

		if (styles == undefined || styles == null || styles == "")	{
			styles = {
				stroke: "black",
				fill: "transparent",
				lineWidth: 1
			};
		}
		
		this.stroke = styles.stroke;
		this.fill = styles.fill;
		this.lineWidth = styles.lineWidth;
	}

	draw()	{
	//	if (this.x + this.r <= canvas.width && this.x - this.r >= 0)	{
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
			c.fillStyle = this.fill;
			c.strokeStyle = this.stroke;
			c.lineWidth = this.lineWidth;
			c.fill();
			c.stroke();
		//}
	}

	hover()	{
		let d = distance(this.x, this.y, mouse.x, mouse.y);
		if (d <= this.r)	{
			return true;
		}
	}

	clicked()	{
		let d = distance(this.x, this.y, lastClick.x, lastClick.y);
		if (d <= this.r)	{
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

		if (styles == undefined || styles == null || styles == "")	{
			styles = {
				stroke: "black",
				fill: "transparent",
				lineWidth: 1
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
	constructor(x, y, z)	{
		this.x = x;
		this.y = y;
		this.z = z;

		if (z == undefined || z == null || z == "")	{
			this.z = 0;
		}

	}

	draw()	{
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(this.x, this.y);
		c.stroke();
	}

	add(objVector)	{
		this.x += objVector.x;
		this.y += objVector.y;
		this.z += objVector.z;
	}

	substract(objVector)	{
		this.x -= objVector.x;
		this.y -= objVector.y;
		this.z -= objVector.z;
	}

	multiply(k)	{
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}

	normalize()	{

		const TEMP = this.module;

		this.x = this.x / TEMP;
		this.y = this.y / TEMP;
		this.z = this.z / TEMP;
	}

	project(objVector)	{
		const CONSTANT = this.dotProduct(objVector) / Math.pow(objVector.module, 2);
		let result = new Vector(objVector.x, objVector.y, objVector.z);
		result.multiply(CONSTANT);

		return result;
	}

	dotProduct(objVector)	{
		return (this.x * objVector.x) + (this.y * objVector.y) + (this.z * objVector.z);
	}

	crossProduct(objVector)	{
		let i = (this.y * objVector.z) - (this.z * objVector.y);
		let j = -((this.x * objVector.z) - (this.z * objVector.x));
		let k = (this.x * objVector.y) - (this.y * objVector.x);

		return new Vector(i, j, k);
	}

	get module()	{
		return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) );
	}
}

class Text	{
	constructor(content, x, y, styles)	{
		this.content = content;
		this.x = x;
		this.y = y;

		if (styles == undefined || styles == null)	{
			this.size = 14;
			this.font = "Times New Roman";
			this.fill = "Black";
			this.stroke = undefined;
		} else	{		
			if (styles.size != undefined)	{
				this.size = styles.size;
			}

			if (styles.font != undefined)	{
				this.font = styles.font;
			}

			if (styles.fill != undefined)	{
				this.fill = styles.fill;
			}
			
			if (styles.maxWidth != undefined)	{
				this.maxWidth = styles.maxWidth;
			}

			if (styles.stroke != undefined)	{
				this.stroke = styles.stroke;
			}
		}

		this.fullStyle = `${this.size}px ${this.font}`;
	}

	draw()	{
			c.beginPath();
			c.font = this.fullStyle;
			c.fillStyle = this.fill;
			
			if (this.stroke != undefined)	{
				c.strokeStyle = this.stroke;
				c.lineWidth = 3;
				c.strokeText(this.content, this.x, this.y, this.maxWidth);
			}
			
			c.fillText(this.content, this.x, this.y, this.maxWidth);		
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
		c.font = this.fullStyle;
		return c.measureText(this.content).width;
	}

	get height()	{
		//return this.size - this.size / 5;
		c.font = this.fullStyle;
		var height = parseInt(c.font.match(/\d+/), 10) * 2;
		return height
	}
}

class MultiLineText extends Text	{
	
	constructor(content, x, y, maxWidth, styles)	{
		super(content, x, y, styles)
		
		this.maxWidth = maxWidth;
		this.w = 100;
		this.h = 100;
	}
	
	draw()	{
		
			// Writing text
			let tempText = this.content.split(" ");
			let maxTempWidth = 0;
			let breaks = 0;
			
			let evalText = tempText[0];
			
			// Looping through text to see the maximum you can put before it exeeds the maximum Width
			for (let i = 0; i < tempText.length; i++)	{

				// Not calculating the width of the <color> command
				if (contains(tempText[i], "<"))	{
					continue;
				}

				let evalObj = new Text(evalText, this.x, this.y, {fill: this.fill, size: this.size, font: this.font});
				
				let xd = new Text(` ${tempText[i]}`, this.x, this.y, {fill: this.fill, size: this.size, font: this.font});

				if (!contains(tempText[i], "\n"))	{
					if (evalObj.width + xd.width <= this.maxWidth)	{
						evalText += xd.content;
						evalObj.content += xd.content;
					} else	{
						tempText.insert(i, " \n ");
						evalText = "";
						breaks++;
					}
					
					if (evalObj.width > maxTempWidth)	{
						maxTempWidth = evalObj.width;
						
					}
				} else	{
					evalText = "";
					breaks++;					
				}		
			}

		tempText = tempText.join(" ");
		this.content = tempText;
		this.w = maxTempWidth;
		this.h = breaks * this.size;
		
		let lines = this.content.split('\n');
		let lineheight = this.size;

		let pos = {
			x: this.x,
			y: this.y
		};
		
		
		// maping colors
		let colorMap = [];
		for (let j = 0; j < lines.length; j++)	{

			let content = lines[j].split(" ");

			for (let i = 0; i < content.length; i++)	{

				if (content[i] == "")	{
					content.splice(i, 1);
					i--;
					continue;
				}

				let temp = {};

				if (contains(content[i], "<") && !contains(content[i], "/"))	{
					
					// Getting the color
					let tempColor = content[i].split("");
					tempColor.pop();
					tempColor.splice(0, 1);
					tempColor = tempColor.join("");

					temp.startLineIndex = j;
					temp.indexStart = i;
					temp.color = tempColor;

					// Pushing the temp variable into the colorMap array
					colorMap.push(temp);

					content[i] = "";		// Removing the <COLOR> tag

				}

				if (contains(content[i], "<") && contains(content[i], "/"))	{

					colorMap[colorMap.length - 1].indexEnd = i;					
					colorMap[colorMap.length - 1].endLineIndex = j;

					content[i] = "";		// Removing the </COLOR> tag
				}

			}

			// Storing the text that has no <color> in it
			content = content.join(" ");
			lines[j] = content;

		}

		

		// Drawing colored lines
		for (let i = 0; i < lines.length; i++) {

			// Updating postions
			pos.x = this.x;
			pos.y = this.y + ( i * lineheight);

			if (colorMap.length > 0)	{

				let tempLine = lines[i].split(" ");				

				for (let value of colorMap)	{

					if (i == value.startLineIndex || i == value.endLineIndex)	{

						if (i == value.endLineIndex && value.startLineIndex != value.endLineIndex)	{
							value.indexStart = 0;
						}

						// Drawing text before color
						const TEXT1 = tempLine.slice(0, value.indexStart).join(" ");				// STRING variable that stores text to write before colored text
						let txt1 = new Text(TEXT1, pos.x, pos.y, {fill: this.fill, size: this.size, font: this.font});
						txt1.draw();
						pos.x += txt1.width;

						// Drawing colored text
						const TEXT2 = tempLine.slice(value.indexStart, value.indexEnd).join(" ");	// STRING variable that stores the colored text
						let txt2 = new Text(TEXT2, pos.x, pos.y, {fill: value.color, size: this.size, font: this.font});
						txt2.fullStyle = `bold ${this.size + 2}px ${this.font}`;
						txt2.draw();
						pos.x += txt2.width;

						tempLine[value.indexStart] = "";		// fixed a bug where colored text was repeated "ex: (120) (120)"

						// Drawing text after color only if start line is the end line (to avoid repetitions)
						if (value.startLineIndex == value.endLineIndex)	{
							const TEXT3 = tempLine.slice(value.indexEnd).join(" ");					// STRING variable that stores text to write after colored text
							let txt3 = new Text(TEXT3, pos.x, pos.y, {fill: this.fill, size: this.size, font: this.font});
							txt3.draw();
							pos.x += txt3.width;
						}

						// Removing lines that has been drawn
						lines[i] = "";

					}
				}
			}		
		}

		// Drawing all lines
		for (let i = 0; i < lines.length; i++)	{	
			if (lines[i] != "")	{
				new Text(lines[i], this.x, this.y + ( i * lineheight), {fill: this.fill, size: this.size, font: this.font}).draw();
			}
		}
		
		
		
	}

	get height()	{
		return this.h;
	}
}

class Image	{
	constructor(src, x, y, w, h, id, showHitBox)	{
		this.src = src;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = id;
		this.showHitBox = showHitBox;
		
		let allImgs = document.getElementById(this.id);
				
		if (allImgs == undefined || allImgs == null)	{
			let body = document.querySelector("body");
			let img = document.createElement("img");
			img.setAttribute("id", this.id);
			img.setAttribute("src", this.src);
			img.setAttribute("style", "display: none");
			body.appendChild(img);				
		} 
		
		this.tempRect = new Rectangle(this.x, this.y, this.w, this.h, {stroke: "red", fill: "transparent"});
	}

	draw()	{
		
		this.tempRect.x = this.x;
		this.tempRect.y = this.y;
		
		if (this.x + this.w >= 0 && this.x <= canvas.width)	{
			let myImage = document.getElementById(this.id);
			myImage.src = this.src;		

			c.drawImage(myImage, this.x, this.y, this.w, this.h);
			
			if (this.showHitBox)	{
				this.tempRect.draw();
			}
			
		}
	}
	
	hover()	{
		/*if (mouse.x > this.x && mouse.x < (this.x + this.width) && mouse.y < this.y && mouse.y > (this.y - this.height))	{
			return true;
		}*/
		
		if (this.tempRect.hover())	{
			lastClick = {x: undefined, y: undefined};
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
			lastClick = {x: undefined, y: undefined};
			return true;
		} else	{
			return false;
		}
		
	}

	updateDimensions(newW, newH)	{
		this.w = newW;
		this.h = newH;
		this.tempRect.w = newW;
		this.tempRect.h = newH;
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
