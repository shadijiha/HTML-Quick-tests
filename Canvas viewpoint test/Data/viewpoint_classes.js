/*** 
 * 
 * Secondery JavaScript file for "Canvas viewpoint test" project 
 * 
 * 
 * This file contains the main CLASSES used in this project
 */
	class Cloud	{
		constructor(x, y)	{
			this.x = x;
			this.y = y;
		}
								// 170, 80
		draw()	{
			c.beginPath();
			c.moveTo(this.x, this.y);
			c.bezierCurveTo(this.x - 40, this.y + 20, this.x - 40, this.y + 70, this.x + 60, this.y + 70);
			c.bezierCurveTo(this.x + 80, this.y + 100, this.x + 150, this.y + 100, this.x + 170, this.y + 70);
			c.bezierCurveTo(this.x + 250, this.y + 70, this.x + 250, this.y + 40, this.x + 220, this.y + 20);
			c.bezierCurveTo(this.x + 260, this.y - 40, this.x + 200, this.y - 50, this.x + 170, this.y - 30);
			c.bezierCurveTo(this.x + 150, this.y - 75, this.x + 80, this.y - 60, this.x + 80, this.y - 30);
			c.bezierCurveTo(this.x + 30, this.y - 75, this.x - 20, this.y - 60, this.x, this.y);
			c.closePath();
			c.lineWidth = 5;
			c.fillStyle = "rgb(230, 230, 230)"; //'#8ED6FF';
			c.fill();
			c.strokeStyle = "grey"; //'#0000ff';
			c.stroke();
		}
	}
 
	class Player extends Rectangle	{
		
		constructor(x, y)	{
			super(x, y, 50, 100, {fill: "pink", lineWidth: 2, stroke: "red"});
			
			this.hp = 1000;
		}	
		
	}
	
	class Item	{
		constructor(name, cost, background, buff)	{
			this.name = name;
			this.cost = cost;
			this.background = background;
			this.buff = buff;
		}
		
		applyBuff()	{
			eval(this.buff);
		}
	}
	

 