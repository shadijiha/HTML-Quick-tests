/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file contains the main classes used in this project
 * 
 *
 */  
 
	// FOR PLAYER SCALING
	let level = 1;		// This INT variable tracks the current level


	class Cloud	{
		constructor(x, y)	{
			this.x = x;
			this.y = y;
		}
								// 170, 80
		draw()	{
			if (this.x >= 0 && this.x <= canvas.width)	{
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
	}
	
	class Player extends Rectangle	{
		constructor(x, y)	{
			super(x, y, 75, 150, {fill: "pink", stroke: "red", lineWidth: 3});
			
			this.gravity = 0.1;
			this.velocity = 0;
			this.lift = -5;
			this.gold = 1500;
			this.goldRegen = 2;

			// these variables are used for the minimap, they store the X and Y coordinates without modification from moveWorld();
			this.initialX = x;
			this.initialY = y;

			// Distance from other monsters and/or player
			this.distanceFromObjects = [];
			
			/****************
			****** Stats ****
			****************/ 
			this.maxHp = 1000;
			this.hp = this.maxHp;
			this.hpRegen = 0.0085;
			this.targetHp = this.maxHp;
			
			// Energy
			this.energy = 200;
			this.energyRegen = 0.0085 * 25;
			this.maxEnergy = 200;
			
			// Sheild
			this.shielded = false;
			this.shieldHp = 200;
			this.shieldMaxHp = 200;
			
			// Armor
			this.armorGroth = 19				// +19 armor per level
			this.baseArmor = 32;
			this.bonusArmor = 0;
			this.armor = this.baseArmor + this.bonusArmor;
			this.armorPen = 0.15;
			this.lithality = 0;

			this.attackSpeed = 1;
			
			// Attack damage
			this.adGroth = 12;					// +12 AD per level
			this.baseAD = 60 + this.adGroth;
			this.bonusAD = 0;
			this.ad = this.baseAD + this.bonusAD;

			// Crit and range
			this.critChance = 0.05;
			this.critMultiplier = 1.5;
			this.range = 500;

			this.lifeStealGroth = 0.07			// 7% life steal per level
			this.baseLifeSteal = 0;
			this.bonusLifeSteal = 0;
			this.lifeSteal = this.baseLifeSteal + this.bonusLifeSteal;
			this.reduceHealing = false;
			

			// Data collected
			this.damageAvoided = 0;
			this.bonusDamageDealt = 0;
			this.healing = 0;
			this.totalDamageDealth = 0;
			this.lastDamageTaken = 0;


			this.immute = false;
			this.untagetable = false;
			this.profile = "Data/Images/player.png";
			this.name = "player"//assignDefault(shadoName, "player");
			this.jumpCost = 50;
			this.ms = 15;

			// itmes
			this.ownedItems = [];
			this.itemsActiveApplied = [];
			this.itemsPassiveApplied = [];	
			this.itemsDataHolder = {};
			this.coolDowns = [];		
			
			this.shootArray = [];
			this.shootImage = "weapon";
			this.bulletSpeed = 5;

			// this.dealthRecap = [{source: "", damageTaken: 0, type: ""}];
			this.dealthRecap = [];

			// For the crit display text and icon
			this.infoArray = [];
		}
		
		damage(source, infoObject)	{

			if (infoObject == undefined)	{
				infoObject = {
					value: undefined,
					type: undefined,
					description: undefined,
					allowCrit: true,
					critDamage: source.critMultiplier
				}
			}

			let value		= assignDefault(infoObject.value, source.ad);
			let damageType	= assignDefault(infoObject.type, "physical");
			let damageDesc	= assignDefault(infoObject.description, "Basic attack");
			let allowCrit		= assignDefault(infoObject.allowCrit, true);
			let critDmg		= assignDefault(infoObject.critDamage, source.critMultiplier);

			/* Making the calculations */
			let tempArmor  = this.armor * (1 - source.armorPen);		// Getting source armor pen	
			tempArmor -= source.lithality;								// Removing the lethality from object's armor
			
			let damageValue = value;									// Reducing damage from armor

			// Applying stuff for TRUE DAMAGE
			if (damageType.toLowerCase() == "true" || damageType.toLowerCase() == "true damage")	{
				tempArmor = 0;
				damageType = "true";
			}

			tempArmor = keepAboveValue(tempArmor, 0);	// Keeping armor above 0

			// Applying damage reduction
			damageValue *= (100 / (100 + tempArmor));

			// Temp stats variables
			let tempBonusDamage = (damageValue) - (value * (100 / (100 + this.armor)));

			if (allowCrit && random(1, 100, true) <= source.critChance * 100)	{

				// Applying crit damage
				damageValue = damageValue * critDmg;
				
				// Displaying the crit damage and crit icon
				if (damageType == "physical")	{
					new Info(this, {value: floor(damageValue), color: "red", image: "Data/Images/Critical_strike_chance.png"});
				} else if (damageType == "true")	{
					new Info(this, {value: floor(damageValue), color: "white", image: "Data/Images/true_critical_strike_chance_icon.png"});
				}					

				// Modifying stat
				tempBonusDamage *= 2;

				// Playing sound
				if (settings.playCritSound)	{
					let audioDOM = document.getElementById("mainAudio");
					audioDOM.src = "Data/sounds/crit sound.mp3";
					audioDOM.volume  = settings.critSoundVolume;
					if (audioDOM.paused && (audioDOM.ended || audioDOM.currentTime == 0) )	{
						document.getElementById("mainAudio").play();
					}
				}
			}
				
			/* Applying life steal to source */
			let healValue = damageValue * source.lifeSteal;
			source.heal(healValue);
				
			// Storing collected stats
			this.damageAvoided += value * (tempArmor / (100 + tempArmor));
			this.lastDamageTaken = damageValue;
			source.bonusDamageDealt += tempBonusDamage;
			source.totalDamageDealth += damageValue;
			if (source.hp < source.maxHp)	{source.healing += healValue};

			// Applying damage to shield or HP
			if (!this.shielded)	{
				this.hp -= damageValue;
			} else	{
				this.shieldHp -= damageValue;
			}

			
			/************************************
			************ death recap ***********
			********************************** */
			var damageSourceExists = false;
			var existsIndex = 0;

			for (let element of this.dealthRecap)	{
				// this.dealthRecap = [{source: "", damageTaken: 0, type: ""}];
				if (damageDesc.toLowerCase() == element.source.toLowerCase())	{
					damageSourceExists = true;
					existsIndex = this.dealthRecap.indexOf(element);
				}
			}

			if (!damageSourceExists)	{
				this.dealthRecap.push({
					source: damageDesc,
					damageTaken: damageValue,
					type: damageType
				});
			} else	{
				this.dealthRecap[existsIndex].damageTaken += damageValue;
			}
		}

		DOT(source, properties)	{

			properties = properties || { value: source.ad, duration: 0.5};

			//var totalTime = amount / tick;
			var value = properties.value || source.ad;
			var duration = properties.duration || 0.5;
			var interval = 0.05;
			var tick = value / duration * interval;
			var totalDamageApplied = 0;
			var objectToApply = this;
			
			const dotInt = setInterval(function()	{

				if (totalDamageApplied < value)	{
					objectToApply.damage(source, { value: tick, allowCrit: false });
					totalDamageApplied += tick;
				} else	{
					clearInterval(dotInt);
				}

			}, interval * 1000);

		}

		heal(amount)	{
			
			var trueAmount = 0; 
			if (this.reduceHealing)	{
				trueAmount = amount * 0.60;		// Take 40% reduce healing
			} else	{
				trueAmount = amount;
			}
			this.hp += trueAmount;

			// Showing the heal amount
			if (trueAmount > 10)	{
				new Info(this, {value: `+${floor(trueAmount)}`, color: "green", size: 25});
			}

		}

		levelUp()	{

			// Refresh attack damage (AD)
			this.baseLifeSteal += this.lifeStealGroth;			

			// Refresh life steal
			this.baseAD += this.adGroth;			

			// Refresh armor
			this.baseArmor += this.armorGroth;			

		}

		update()	{
			
			// Drawing image
			if (this.immute && this.hp <= this.maxHp * 0.20)	{				
				this.hp = this.maxHp * 0.20;
			}
			if (this.untagetable)	{
				c.globalAlpha = 0.5;
			}
			new Image(this.profile, this.x, this.y, this.w, this.h, this.profile, settings.showHitBox).draw();
			c.globalAlpha = 1;

			// Drawing "Grievous_Wounds_icon" if object reduceHealing is true
			if (this.reduceHealing)	{
				new Image("Data/Images/Grievous_Wounds_icon.png", this.x + this.w, this.y, 25, 25, "Grievous_Wounds_icon").draw();
				
				// Showing the buff indicator on HUD
				if (!this.tempHealReducingHUD)	{
					this.tempHealReducingBuff = new Buff(15358, "", "Data/Images/Grievous_Wounds_icon.png", this, `This unit is affected by the <b><u>Glorious Executioner</u></b><br /><br />Glorious Executioner: healing from all sources is reduced by 40%`);
					this.tempHealReducingHUD = true;
				}

			} else if (this.tempHealReducingHUD)	{
				this.tempHealReducingBuff.delete();
				this.tempHealReducingHUD = undefined;
			}

			// Applying gravity
			if (!player.ultActive)	{
				this.force();
			}

			// Verifying collisions with platformes
			for (let platforme of platformes)	{
				if ( collision(this, platforme) )	{
					if (this.y  < platforme.y)	{
						this.y = platforme.y - this.h;
						this.velocity = 0;				// Setting velocity to 0 to prevent gravity accumulation					
					} else	{
						this.y = platforme.y + platforme.h;
						this.force();
					}
					break;
				}
			}

			// Drawing all OBJECT's bullets from this.shootArray[] and remove out of range bullets
			for (let bullet of this.shootArray)	{
				bullet.showHitBox = settings.showHitBox;
				bullet.draw();
				bullet.x += this.bulletSpeed;

				if (distance(bullet.bulletStartX, bullet.bulletStartY, bullet.x, bullet.y) >= this.range)	{
					this.shootArray.splice(this.shootArray.indexOf(bullet), 1);
				}

			}

			// Updating all Cooldowns
			for (let cooldown of this.coolDowns)	{
				cooldown.update();
			}
												
			// Generating HP and energy			
			this.energy += this.energyRegen;
			this.heal(this.hpRegen);

			// Shielding			
			if (this.shielded && this.shieldHp > 0)	{
				this.shield();
			}

			// Display all infos and damage text
			for (let info of this.infoArray)	{
				info.draw(this);
			}

			// Keeping stats normal
			this.critChance		= keepBelowValue(this.critChance, 1);
			this.hp				= keepBelowValue(this.hp, this.maxHp);
			this.hp				= keepAboveValue(this.hp, 0);
			this.energy			= keepBelowValue(this.energy, this.maxEnergy);
			this.energy			= keepAboveValue(this.energy, 0);
			this.attackSpeed	= keepAboveValue(this.attackSpeed, 0.4);

			// Updating all object stats
			this.lifeSteal	= this.baseLifeSteal + this.bonusLifeSteal;
			this.ad			= this.baseAD + this.bonusAD;
			this.armor		= this.baseArmor + this.bonusArmor;
		}

		force()	{
			this.velocity += this.gravity;
			this.y += this.velocity;
			
			if (this.y > world.level - this.h)	{
				this.y = world.level - this.h;
				this.velocity = 0;
			}
			
			if (this.y < 0)	{
				this.y = 0;
				this.velocity = 0;
			}
		}
		
		jump()	{
			if (this.energy > this.jumpCost && this.hp > 0)	{
				this.velocity += this.lift;
				this.energy -= this.jumpCost;
			}
		}

		showHpBar(posX, posY, width, height, showText, strokeSize)	{

			// Setting default stroke size
			if (strokeSize == undefined || strokeSize == null || strokeSize == 0 || strokeSize == "")	{
				strokeSize = 4;
			}

			// Generat info
			let startingPointX = posX;
			let startingPointY = posY;
			let barWidth = width;
			let barHeight = height;

			// Keeping normal hp (Checking if HP is lower than 0 or higher than max HP) another time (first in this.update())
			if (this.hp < 0)	{
				this.hp = 0;
			}						
			if (this.hp > this.maxHp)	{
				this.hp = this.maxHp;
			}

			// Indicate the healing reduction if any (variable to multiply with the hpRegen)
			let regenModifier = 1;
			if (this.reduceHealing)	{
				regenModifier = 0.60;
			} else	{
				regenModifier = 1;
			}
			
			// Checking if shield is lower than 0
			if (this.shieldHp <= 0)	{
				this.shielded = false;
				this.shieldHp = 0;
			}			
			
			let percentage = this.hp / this.maxHp;						// This FLOAT variable is used to calculate the width of the inner hp bar
			let shieldPercentage = this.shieldHp / this.shieldMaxHp;	// This FLOAT variable is used to calculate the width of the inner shield bar
			
			// Drawing the main container bar (outer)
			new Rectangle(startingPointX, startingPointY, barWidth, barHeight, {fill: "white", lineWidth: strokeSize / 2, stroke: "black"}).draw();
			
			// Drawing the inner (colored) bars
			let outputText = "";	 	// This STRING variable stores the displayed numbers on the hp bar			
			let secondaryBar;			// This OBJECT variable stores the outer (colored) hp bar data
			let shieldBar;				// This OBJECT variable stores the outer (colored) shield bar data
			
			if (!this.shielded)	{
				secondaryBar = new Rectangle(startingPointX + (strokeSize / 2), startingPointY + (strokeSize / 2), barWidth * percentage - strokeSize, barHeight - strokeSize, {fill: "green", stroke: "green"});
				
				// Setting text if unit shieled
				outputText = `${Math.floor(this.hp)} / ${Math.floor(this.maxHp)} + ${(this.hpRegen * regenModifier * 100).toFixed(1)}`;
				
			} else	{
				
				percentage = this.hp / (this.maxHp + this.shieldHp);
				shieldPercentage = this.shieldHp / (this.maxHp + this.shieldHp);
				
				let hpBarWidth = barWidth * percentage;
				
				secondaryBar = new Rectangle(startingPointX + 2, startingPointY + (strokeSize / 2), hpBarWidth - strokeSize, barHeight - strokeSize, {fill: "green", stroke: "green", lineWidth: 1});
				shieldBar = new Rectangle(startingPointX + hpBarWidth + (strokeSize / 2), startingPointY + (strokeSize / 2), barWidth * shieldPercentage - strokeSize, barHeight - strokeSize, {fill: "yellow", stroke: "yellow", lineWidth: 1})
				shieldBar.draw();
				
				// Setting text if unit isn't shielded
				outputText = `${Math.floor(this.hp + this.shieldHp)} / ${Math.floor(this.maxHp + this.shieldHp)} + ${(this.hpRegen * regenModifier * 100).toFixed(1)}`;				
			}
						
			// Changing the color of "Object secondaryBar" based on missing health
			if (this.hp > this.maxHp * 0.5 && !this.immute)	{
				secondaryBar.fill = "green";
				secondaryBar.stroke = "green";
			} else if (this.hp > this.maxHp * 0.25 && this.hp < this.maxHp * 0.5 && !this.immute)	{
				secondaryBar.fill  = "orange";
				secondaryBar.stroke = "orange";
			} else if (this.hp < this.maxHp * 0.25 && !this.immute)	{
				secondaryBar.fill = "red";
				secondaryBar.stroke = "red";
			}

			// Drawing "Object secondaryBar" only if there is hp to avoid bugs
			if (this.hp > 1)	{
				secondaryBar.draw();
			}		
			
			// Changing "Object secondaryBar" color and width if unit is immute
			if (this.immute)	{
				/*secondaryBar.fill = "#FFD700";
				secondaryBar.stroke = "#FFD700";
				secondaryBar.color = "black";
				secondaryBar.w = barWidth;
				outputText = "∞ / ∞ + ∞";*/
				new Rectangle(startingPointX, startingPointY, (barWidth * 0.20), barHeight, {fill: "#FFD700", stroke: "#FFD700", lineWidth: 1}).draw();
			}
			
			// showing numbers on the hp bar if requested
			if (showText)	{
				new Text(outputText, startingPointX + barWidth / 2 - 50, startingPointY +barHeight - 20, {size: 24, fill: "black", font: "Arial"}).draw();
			}
		}
		
		showEneryBar(posX, posY, width, height, showText, strokeSize)	{

			// Setting default stroke size
			if (strokeSize == undefined || strokeSize == null || strokeSize == 0 || strokeSize == "")	{
				strokeSize = 4;
			}

			this.energyBarX = posX;
			this.energyBarY = posY;
			this.energyBarW = width;
			this.energyBarH = height;
			
			let hpBarColor = "#0080FF";
			let percentage = this.energy / this.maxEnergy;
			
			// Drawing the acual bar
			new Rectangle(this.energyBarX, this.energyBarY, this.energyBarW, this.energyBarH, {stroke: "black", fill: "white", lineWidth: strokeSize / 2}).draw();
			new Rectangle(this.energyBarX + strokeSize / 3, this.energyBarY + strokeSize / 3, this.energyBarW * percentage - (strokeSize / 3), this.energyBarH - strokeSize / 3, {stroke: "transparent", fill: hpBarColor, lineWidth: 0}).draw();
			
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

		shoot(img, _y)	{

			if (_y == undefined || _y == null || _y == "")	{
				_y = this.y + this.h / 2;
			}

			if (this.hp > 0)	{
				let tempBullet = new Image(`Data/Images/${img}.png`, this.x, _y, 50, 20, img);
				tempBullet.bulletStartX = this.x;
				tempBullet.bulletStartY = _y;
				this.shootArray.push(tempBullet);
				worldElements.push(tempBullet);
			}
		}

		ult()	{
			document.getElementById("ultAudio").play();

			player.ultActive = true;

			setTimeout(function()	{
				player.ultActive = false;
			}, 7 * 1000)
		}

	}
	
	class Item	{
		constructor(name, cost, img, description)	{
			this.name = name;
			this.cost = cost;
			this.sell = this.cost * 0.7;
			this.img = img;
			this.description = description;
			//this.buffApplied = false;
			//this.conditionAquired = false;
			this.ownedByPlayer = false;


			// Pushing every item created to "allItmes" array
			let exists = false;
			for (let i = 0; i < allItmes.length; i++)	{
				if (allItmes[i].name == this.name)	{
					exists = true;

					// if it exists updating the item in the array
					allItmes[i].name = this.name;
					allItmes[i].cost = this.cost;
					allItmes[i].description = this.description;
					allItmes[i].img = this.img;
					allItmes[i].sell = this.sell;
				}
			}

			if (!exists)	{
				allItmes.push(this);
			}

		}
		
		applyBuff(myObject)	{

			let containsItem = false;

			for (let i = 0; i < myObject.itemsActiveApplied.length; i++)	{
				if (myObject.itemsActiveApplied[i].name == this.name)	{
					containsItem = true;
					break;
				}
			}

			if (!containsItem)	{
				this.buff(myObject);
				myObject.itemsActiveApplied.push(this);
				//this.buffApplied = true;
			}

		}
		
		continousBuff(myObject)	{
			/*if (!this.conditionAquired && this.evalBuff != undefined)	{
				this.passive(myObject);
			}*/

			let containsItemPassive = false;

			for (let i = 0; i < myObject.itemsPassiveApplied.length; i++)	{
				if (myObject.itemsPassiveApplied[i].name == this.name)	{
					containsItemPassive = true;
					break;
				}
			}

			if (!containsItemPassive && this.passive != undefined)	{
				this.passive(myObject);
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

			let exists = false;
			for (let allWindow of allWindows)	{
				if (allWindow.title == this.title)	{
					exists = true;
					break;
				}
			}

			if (!exists)	{
				allWindows.push(this);
			}

		}
		
		draw()	{			
			if (this.opened)	{
				// Main window
				//new Rectangle(this.x, this.y, this.w, this.h, {fill: "white", stroke: "#121212", lineWidth: 3}).draw();
				c.beginPath();
				c.moveTo(this.x, this.y);
				c.arcTo(this.x, this.y, this.x + this.w, this.y, 20);
				c.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h, 20);
				c.arcTo(this.x + this.w, this.y + this.h, this.x, this.y + this.h, 20);
				c.arcTo(this.x, this.y + this.h, this.x, this.y, 20);
				c.arcTo(this.x, this.y, this.x, this.y, 20);
				c.fillStyle = "white";
				c.strokeStyle = "#121212";
				c.lineWidth = 2;
				c.fill();
				c.stroke();
				
				// Title bar
				this.closeButton = new Image("Data/Images/closeButton.png", this.x + this.w - 50, this.y, 50, 50, "close_button");
				new Rectangle(this.closeButton.x, this.closeButton.y, this.closeButton.w, this.closeButton.h, {fill: "#121212"}).draw(); // Extending the title bar to under the close image
				
				this.titleBarObj = new Rectangle(this.x, this.y, this.w - this.closeButton.w, 50, {fill: "#121212"});
				this.titleBarObj.draw();
				new Text(this.title, this.x + 15, this.y + 33, {size: 28, font: "Arial", fill: "white"}).draw();
				
				
				this.closeButton.draw();
				if (this.closeButton.clicked())	{
					this.close();
				}
			}

			this.drag();
		}
		
		open()	{

			for (let allWindow of allWindows)	{
				allWindow.opened = false;
			}
			
			this.opened = true;
			this.draw();
		}

		onclose()	{
			console.log(`Warning! "${this.title}" window has no onclose() function to execute`);
		}

		close()	{
			this.opened = false;
			this.onclose();
		}
		
		drag()	{			
			if (dragged && this.titleBarObj != undefined && this.titleBarObj.hover())	{
				if (this.titleBarObj != undefined)	{
					this.x = mouse.x - this.titleBarObj.w / 2;
					this.y = mouse.y - this.titleBarObj.h / 2;
				}
			}
		}
		
	}

	class Description {
		constructor(txt, x, y, w)	{
			this.x = x;
			this.y = y;
			this.w = w;
			this.txt = txt;
			this.padding = 15;
			this.fill = "rgba(0, 0, 0, .7)";
			this.color = "white";
			this.size = 16;
			this.font = "Arial";
		}

		draw()	{

			

			let text = new MultiLineText(this.txt, this.x + this.padding, this.y + this.padding * 2, this.w, {size: this.size, fill: this.color, font: this.font});


			let mainRect = new Rectangle(this.x, this.y, this.w + this.padding * 2, text.height + this.padding, {fill: this.fill, stroke: "black", lineWidth: 1});

			mainRect.draw();
			text.draw();

		}

	}

	class Platforme	extends Image	{
		constructor(x, y, w)	{
			super("Data/Images/platforme.png", x, y, w, 50, "platform", settings.showHitBox);

			let exists = false;
			for (let platforme of platformes)	{
				if (platforme.x == this.x && platforme.y == this.y)	{
					exists = true;
				}
			}

			if (!exists)	{
				platformes.push(this);
				worldElements.push(this);
			}

		}

		draw()	{
			super.draw();
			this.showHitBox = settings.showHitBox;
		}
	}

	class Meter {
		constructor(percentage, x, y, w)	{
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = 30;
			this.color = "#00ccff";
			this.percentage = percentage;
			this.barWidth = 0;
		}

		draw()	{

			if (this.percentage < 0)	{
				this.percentage = 0;
			}

			if (this.percentage > 1)	{
				this.percentage = 1;
			}

			// Container
			new Rectangle(this.x, this.y, this.w, this.h, {fill: "white", stroke: "black", lineWidth: 3}).draw();

			// Inner bar
			this.barWidth = (this.w - 4) * this.percentage;
			new Rectangle(this.x + 2, this.y + 2, this.barWidth, this.h - 4, {fill: this.color, stroke: this.color, lineWidth: 1}).draw();

		}

		clicked()	{
			if (lastClick.x > this.x && lastClick.x < (this.x + this.w) && lastClick.y > this.y && lastClick.y < (this.y + this.h))	{
				return true;
			}
		}
	}

	class Loot extends Image	{
		constructor(src, x, y, des)	{
			super(src, x, y, 30, 30, src, settings.showHitBox);

			this.des = des;

			let exists = false;
			for (let loot of loots)	{
				if (loot.x == this.x && loot.y == this.y)	{
					exists = true;
				}
			}

			if (!exists)	{
				loots.push(this);
				worldElements.push(this);
			}
		}

		update()	{			
			this.showHitBox = settings.showHitBox;
			this.draw();

			if (collision(this, player))	{
				if (this.buff != undefined)	{
					this.buff();
					loots.splice(loots.indexOf(this), 1);
					worldElements.splice(worldElements.indexOf(this), 1);
				}
			}

			if (this.hover())	{
				let temp = new Description(this.des, mouse.x, mouse.y, 300);
				temp.fill = "rgba(0, 0, 0, .7)";
				temp.color = "white";
				temp.font = "Arial";
				temp.draw();
			}
		}
	}

	class Ability	{
		constructor (id, totalTime, background, obj, description, constumX)  {

			this.x = assignDefault(constumX, (obj.coolDowns.length * 60) + 500);
			this.y = canvas.height * 0.82 - 52;
			this.d = 50;
			this.totalTime = totalTime - 0.1;
			this.background = background;
			this.description = description;
			this.tempDistance = 0;
			this.id = id;

			this.mainRect = new Rectangle(this.x, this.y, this.d, this.d, {fill: "transparent", stroke: "black", lineWidth: 3});
			this.perimetre = (this.mainRect.w + this.mainRect.h) * 2;

			this.currentX = this.mainRect.x + this.mainRect.w / 2 + 2;
			this.currentY = this.mainRect.y;

			this.speed = this.perimetre / this.totalTime / CANVASFPS;
			this.velocityX = this.speed;
			this.velocityY = 0;

			this.obj = obj;

			this.type = "ability";
			
			if (this.background == undefined)	{
				this.background = "";
			}

			let exists = false;

			for (let coolDown of this.obj.coolDowns)	{
				if (coolDown.id == this.id)	{
					exists = true;
					break;
				}
			}

			if (!exists)	{
				this.obj.coolDowns.push(this);
			}

		
		}
	
		update()	{

			//this.speed = this.perimetre / this.totalTime / FPS;

			if (this.currentX > this.mainRect.x + this.mainRect.w)	{
				this.velocityX = 0;
				this.velocityY = this.speed;
				this.currentX = this.mainRect.x + this.mainRect.w;
			}

			if (this.currentY > this.mainRect.y + this.mainRect.h)	{
				this.velocityX = -this.speed;
				this.velocityY = 0;
				this.currentY = this.mainRect.y + this.mainRect.h;
			}

			if (this.currentX < this.mainRect.x)	{
				this.velocityX = 0;
				this.velocityY = -this.speed;
				this.currentX = this.mainRect.x;
			}

			if (this.currentY < this.mainRect.y)	{
				this.velocityX = this.speed;
				this.velocityY = 0;
				this.currentY = this.mainRect.y;
			}

			this.currentX += this.velocityX;
			this.currentY += this.velocityY;

			this.tempDistance += this.speed;
		}
		
		draw()	{

			if (this.tempDistance <= this.perimetre)	{

				// update
				//this.update();

				// Main
				this.mainRect.draw();

				// Background
				if (this.background != undefined && this.background != "" && this.background != " ")	{
					new Image(this.background, this.x, this.y, this.d, this.d, this.background).draw();
				}

				// Line
				c.beginPath();
				c.strokeStyle = "white";
				c.lineWidth = 3;
				c.moveTo(this.mainRect.x + this.mainRect.w / 2, this.mainRect.y + this.mainRect.h / 2);
				c.lineTo(this.currentX, this.currentY);
				c.stroke();		

				// Draw text
				this.remainingTime = floor(this.totalTime - (this.tempDistance / this.perimetre * this.totalTime)) + 1;
				new Text(this.remainingTime, this.x, this.y + this.d, {font: "Arial", fill: "white", size: 30}).draw();


				// Shwoing description
				if (this.mainRect.hover())	{
					showDescription(this.description);
				}


			} else	{
				this.delete();
			}

		}

		delete()	{

			for (let i = 0; i < this.obj.coolDowns.length; i++)	{
				if (this.obj.coolDowns[i].id == this.id)	{
					this.obj.coolDowns.splice(i, 1);
				}
			}

		}

		showDescription(text)	{
			showDescription(text);
		}
	}

	class Buff	{
		constructor (id, text, background, obj, description, constumX)  {

			this.obj = obj;

			this.x = assignDefault(constumX, ((this.obj.coolDowns.length) * 60) + 500);
			this.y = canvas.height * 0.82 - 52;
			this.d = 50;
			this.background = background;
			this.description = description;
			this.text = text;
			this.id = id;

			this.mainRect = new Rectangle(this.x, this.y, this.d, this.d, {fill: "transparent", stroke: "black", lineWidth: 3});
			this.perimetre = (this.mainRect.w + this.mainRect.h) * 2;

			this.currentX = this.mainRect.x + this.mainRect.w / 2 + 2;
			this.currentY = this.mainRect.y;

			this.speed = this.perimetre / this.totalTime / CANVASFPS;
			this.velocityX = this.speed;
			this.velocityY = 0;

			this.type = "buff";

			
			
			if (this.background == undefined)	{
				this.background = "";
			}

			let exists = false;

			for (let coolDown of this.obj.coolDowns)	{
				if (coolDown.id == this.id)	{
					exists = true;
					coolDown.text = this.text;
					coolDown.description = this.description;
					break;
				}
			}

			if (!exists)	{
				this.x = assignDefault(constumX, ((this.obj.coolDowns.length) * 60) + 500);
				obj.coolDowns.push(this);

			}

		
		}

		update()	{

			for (let coolDown of this.obj.coolDowns)	{
				if (coolDown.x == this.x && coolDown.id != this.id)	{
					this.x += 60;
				}
			}

		}
		
		draw()	{

				// Main
				this.mainRect.x = this.x;
				this.mainRect.y = this.y;
				this.mainRect.draw();

				// Background
				if (this.background != undefined && this.background != "" && this.background != " ")	{
					new Image(this.background, this.x, this.y, this.d, this.d, this.background).draw();
				}

				// Draw text
				new Text(this.text, this.x, this.y + this.d, {font: "Arial", fill: "white", size: 25}).draw();

				// Shwoing description
				if (this.mainRect.hover())	{
					showDescription(this.description);
				}

		}

		delete()	{

			for (let i = 0; i < this.obj.coolDowns.length; i++)	{
				if (this.obj.coolDowns[i].id == this.id)	{
					this.obj.coolDowns.splice(i, 1);
				}
			}

		}

	}

	class Info	{
		constructor(object, data)	{
			this.x = 0;
			this.y = 0;
			this.img = data.image || "";
			this.color = data.color;
			this.value = data.value || "";
			this.object = object;
			this.size = data.size || 30;

			this.maxDistance = 150;
			this.angle = -data.angle || random(0, Math.PI * 2);
			this.velocityX = Math.cos(this.angle);
			this.velocityY = Math.sin(this.angle);

			// Add it to objec info
			var exists = false;
			for (var temp of object.infoArray)	{
				if (temp == this)	{
					exists = true;
				}
			}

			if (!exists)	{
				object.infoArray.push(this);
			}

		}

		draw(sourceObject)	{

			var evalDistance = distance(this.x + sourceObject.x, this.y + sourceObject.y, sourceObject.x, sourceObject.y);
			if (evalDistance <= this.maxDistance)	{

				c.globalAlpha = 1 - (evalDistance / this.maxDistance);

				if (this.img != "")	{
					new Image(this.img, this.x + sourceObject.x, this.y - 50 + sourceObject.y, 25, 25, this.img).draw();
				}
				new Text(this.value, this.x + 30 + sourceObject.x, this.y - 25 + sourceObject.y, {size: this.size, fill: this.color, font: "Arial"}).draw();

				c.globalAlpha = 1;

				this.x += this.velocityX;
				this.y += this.velocityY;
				
			} else	{
				sourceObject.infoArray.splice(sourceObject.infoArray.indexOf(this), 1);
			}
		}
	}

	class Decoration extends Image	{

		constructor(img, x, y, w, h)	{
			super(img, x, y, w, h, img);

			let exists = false;

			for (let decoration of decorations)	{
				if (decoration.x == this.x && decoration.y == this.y)	{
					exists = true;
					break;
				}
			}

			if (!exists)	{
				decorations.push(this);
				worldElements.push(this);
			}

		}

	}