/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file contains the main classes used in this project
 * 
 *
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
			super(x, y, 75, 150, {fill: "pink", stroke: "red", lineWidth: 3});
			
			this.gravity = 0.15;
			this.velocity = 0;
			this.lift = -5;
			this.gold = 20000;
			
			// Stats
			this.hp = 1000;
			this.maxHp = 1000;
			this.hpRegen = 0.0085;
			
			this.energy = 200;
			this.energyRegen = 0.0085 * 10;
			this.maxEnergy = 200;
			
			this.shielded = false;
			this.shieldHp = 200;
			this.shieldMaxHp = 200;
			
			this.armor = 30;
			this.armorPen = 0;
			//this.magicResiste = 30;
			this.attackSpeed = 0.80;
			
			this.lifeSteal = 0;
			this.ad = 60;
			this.critChance = 0;
			
			this.immute = false;
			this.profile = "http://localhost/HTML/HTML processing and p5 js sruff/Game test/data/images/player.png";
			this.jumpCost = 50;
			this.ms = 10;
			this.itemOwnedCount = 0;
			this.ownedItems = [];
			
			this.shootArray = [];
		}
		
		damage(source)	{
			
			let tempArmor  = this.armor * (1 - source.armorPen);			
			let damageValue = this.ad * (100 / (100 + tempArmor));
			
			if (random(0, 100, true) <= source.critChance * 100)	{
				damageValue = damageValue * 2;
			}
			
			if (!this.immute && this.hp > 0)	{
				if (!this.shielded)	{
					this.hp -= damageValue;
				} else	{
					this.shieldHp -= damageValue;
				}
			}
		}
		
		update()	{
			this.velocity += this.gravity;
			this.y += this.velocity;
			
			if (this.y > world.level - this.h)	{
				this.y = world.level - this.h;
				this.velocity = 0;
			}
			
			if (this.y < 0)	{
				this.y = 0;
			}
			
			//this.draw();
			
			// Shielding			
			if (this.shielded && this.shieldHp > 0)	{
				this.shield();
			}
		}
		
		jump()	{
			if (this.energy > this.jumpCost)	{
				this.velocity += this.lift;
				this.energy -= this.jumpCost;
			}
		}

		showHpBar(posX, posY, width, height, showText)	{
			
			// Generating HP
			this.hp += this.hpRegen;
			
			// Generat info
			let startingPointX = posX;
			let startingPointY = posY;
			let barWidth = width;
			let barHeight = height;
			
			// Showing normal hp
			if (this.hp < 0)	{
				this.hp = 0;
			}
			
			if (this.hp > this.maxHp)	{
				this.hp = this.maxHp;
			}
			
			if (this.shieldHp <= 0)	{
				this.shielded = false;
				this.shieldHp = 0;
			}
			
			
			// Drawing the main container bar
			let percentage = this.hp / this.maxHp;
			let shieldPercentage = this.shieldHp / this.shieldMaxHp;
			
			new Rectangle(startingPointX, startingPointY, barWidth, barHeight, {fill: "white", lineWidth: 3, stroke: "black"}).draw();
			
			// Drawing the inner bars
			let outputText = "";
			
			let secondaryBar;
			let shieldBar;
			
			if (!this.shielded)	{
				secondaryBar = new Rectangle(startingPointX + 2, startingPointY + 2, barWidth * percentage - 4, barHeight - 4, {fill: "green", stroke: "green"});
				
				outputText = `${Math.floor(this.hp)} / ${Math.floor(this.maxHp)} + ${(this.hpRegen * 100).toFixed(1)}`;
				
			} else	{
				
				percentage = this.hp / (this.maxHp + this.shieldHp);
				shieldPercentage = this.shieldHp / (this.maxHp + this.shieldHp);
				
				let hpBarWidth = barWidth * percentage;
				
				secondaryBar = new Rectangle(startingPointX + 2, startingPointY + 2, hpBarWidth - 4, barHeight - 4, {fill: "green", stroke: "green", lineWidth: 1});
				shieldBar = new Rectangle(startingPointX + hpBarWidth + 2, startingPointY + 2, barWidth * shieldPercentage - 4, barHeight - 4, {fill: "yellow", stroke: "yellow", lineWidth: 1})
				shieldBar.draw();
				
				
				outputText = `${Math.floor(this.hp + this.shieldHp)} / ${Math.floor(this.maxHp + this.shieldHp)} + ${(this.hpRegen * 100).toFixed(1)}`;				
			}			
			
			// if Target is immute
			if (this.immute)	{
				secondaryBar.fill = "#FFD700";
				secondaryBar.stroke = "#FFD700";
				secondaryBar.color = "black";
				outputText = "∞ / ∞ + ∞";	
			}
			
			// Changing the color
			if (this.hp > this.maxHp * 0.5)	{
				secondaryBar.fill = "green";
				secondaryBar.stroke = "green";
			} else if (this.hp > this.maxHp * 0.25 && this.hp < this.maxHp * 0.5)	{
				secondaryBar.fill  = "orange";
				secondaryBar.stroke = "orange";
			} else if (this.hp < this.maxHp * 0.25)	{
				secondaryBar.fill = "red";
				secondaryBar.stroke = "red";
			}

			if (this.hp > 1)	{
				secondaryBar.draw();
			}
			
			if (showText)	{
				new Text(outputText, startingPointX + barWidth / 2 - 50, startingPointY +barHeight - 20, {size: 24, fill: "black", font: "Arial"}).draw();
			}
		}
		
		showEneryBar(posX, posY, width, height, showText)	{
									
			// Generating energy			
			this.energy += this.energyRegen;
			
			// Checking if energy is less or greater than limit			
			if (this.energy < 0)	{
				this.energy = 0;
			} else	if (this.energy > this.maxEnergy){
				this.energy = this.maxEnergy;
			}
			
			this.energyBarX = posX;
			this.energyBarY = posY;
			this.energyBarW = width;
			this.energyBarH = height;
			
			let hpBarColor = "blue";
			let percentage = this.energy / this.maxEnergy;
			
			// Drawing the acual bar
			new Rectangle(this.energyBarX, this.energyBarY, this.energyBarW, this.energyBarH, {stroke: "black", fill: "white", lineWidth: 3}).draw();
			new Rectangle(this.energyBarX + 1, this.energyBarY + 1, this.energyBarW * percentage - 1, this.energyBarH - 2, {stroke: "transparent", fill: hpBarColor, lineWidth: 0}).draw();
			
			// Drawing the text
			if (showText)	{
				new Text(`${Math.floor(this.energy)} / ${Math.floor(this.maxEnergy)} + ${(this.energyRegen * 100).toFixed(1)}`, this.energyBarX + this.energyBarW / 2 - 50, this.energyBarY + this.energyBarH - 20, {size: 24, fill: "black", font: "Arial"}).draw();
			}
		}

		shield()	{
			
			c.globalAlpha = 0.7;
			new Circle(this.x + this.w / 2, this.y + this.h / 2, this.h / 2 * 1.20, {fill: "lightgrey", stroke: "grey", lineWidth: 3}).draw();
			c.globalAlpha = 1;
			
		}

		shoot(img)	{
			let tempBullet = new Image(`Data/Images/${img}.png`, this.x, this.y + this.h / 2, 50, 20, img);
			this.shootArray.push(tempBullet);
			worldElements.push(tempBullet);
		}

	}
	
	class Item	{
		constructor(name, cost, img, description)	{
			this.name = name;
			this.cost = cost;
			this.sell = this.cost * 0.7;
			this.img = img;
			this.description = description;
			this.buffApplied = false;
			this.conditionAquired = false;
		}
		
		applyBuff(myObject)	{
			if (!this.buffApplied)	{
				this.buff(myObject);
				this.buffApplied = true;
			}
		}
		
		continousBuff(myObject)	{
			if (!this.conditionAquired && this.evalBuff != undefined)	{
				this.evalBuff(myObject);
			}
			
		}
		
		removeBuff(tempObject)	{
			this.antiBuff(tempObject);
		}
	}
	
	class Window {
		
		constructor(x, y, w, h, title)	{
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.title = title;
			this.opened = false;
			
			this.titleBarObj = undefined;
			this.closeButton = undefined;
		}
		
		draw()	{			
			if (this.opened)	{
				// Main window
				new Rectangle(this.x, this.y, this.w, this.h, {fill: "white", stroke: "#121212", lineWidth: 3}).draw();
				
				// Title bar
				this.closeButton = new Image("Data/Images/closeButton.png", this.x + this.w - 50, this.y, 50, 50, "close_button");
				new Rectangle(this.closeButton.x, this.closeButton.y, this.closeButton.w, this.closeButton.h, {fill: "#121212"}).draw(); // Extending the title bar to under the close image
				
				this.titleBarObj = new Rectangle(this.x, this.y, this.w - this.closeButton.w, 50, {fill: "#121212"});
				this.titleBarObj.draw();
				new Text(this.title, this.x + 15, this.y + 33, {size: 28, font: "Arial", fill: "white"}).draw();
				
				
				this.closeButton.draw();
				if (this.closeButton.clicked())	{
					this.opened = false;
				}
			}

			this.drag();
		}
		
		open()	{
			this.opened = true;
		}
		
		drag()	{			
			if (dragged && this.titleBarObj.hover())	{
				if (this.titleBarObj != undefined)	{
					this.x = mouse.x - this.titleBarObj.w / 2;
					this.y = mouse.y - this.titleBarObj.h / 2;
				}
			}
		}
		
	}