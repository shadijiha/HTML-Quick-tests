/***  
 * JavaScript main file for "Shado game Shield test" project 
 * 
 * 
 */ 
	createCanvas(window.innerWidth, window.innerHeight);
	
	// Gloabal variables
	let levelY = 650;
	let paused = false;
	let damage = 1000;
	
	// Classes
	class Player extends Rectangle	{

		constructor(x, y, w, h, styles)	{
			super(x, y, w, h, styles);
			
			this.shielded = false;
			this.hp = 1000;
			this.maxHp = 1000;
			this.shieldHp = 9000;
			this.shieldMaxHp = 9000;
			
		}
		
		hpBar()	{
			
			// Generat info
			let startingPointX = this.x - 40;
			let startingPointY = this.y - 50;
			let barWidth = this.w * 2;
			
			// Showing normal hp
			if (this.hp < 0)	{
				this.hp = 0;
			}
			
			if (this.shieldHp <= 0)	{
				this.shielded = false;
				this.shieldHp = 0;
			}
			
			
			// Drawing the main container bar
			let percentage = this.hp / this.maxHp;
			let shieldPercentage = this.shieldHp / this.shieldMaxHp;
			
			new Rectangle(startingPointX, startingPointY, barWidth, 30, {fill: "transparent", lineWidth: 3}).draw();
			
			// Drawing the inner bars		
			if (!this.shielded)	{
				new Rectangle(startingPointX, startingPointY, barWidth * percentage, 30, {fill: "green"}).draw();
			} else	{
				
				percentage = this.hp / (this.maxHp + this.shieldHp);
				shieldPercentage = this.shieldHp / (this.maxHp + this.shieldHp);
				
				let hpBarWidth = barWidth * percentage;
				
				new Rectangle(startingPointX, startingPointY, hpBarWidth, 30, {fill: "green"}).draw();
				new Rectangle(startingPointX + hpBarWidth, startingPointY, barWidth * shieldPercentage, 30, {fill: "yellow"}).draw();
				
			}
			
			// Seperator
			if (!this.shielded)	{
				this.tempShieldMaxHp = 0;
			} else	{
				this.tempShieldMaxHp = this.shieldHp;
			}
			
			let augmentation = barWidth * (500 / (this.maxHp + this.tempShieldMaxHp));
			let placement = startingPointX;
			
			let xd = Math.floor((this.maxHp + this.tempShieldMaxHp) / 500);

			for (let i = 0; i < xd; i++)	{
				c.beginPath();
				c.moveTo(placement, startingPointY);
				c.lineTo(placement, startingPointY + 10);
				c.lineWidth = 3;
				c.stroke();

				placement += augmentation;
			}
			
		}
		
		shield()	{
			c.globalAlpha = 0.6;
			
			new Circle(this.x + this.w / 2, this.y + this.h / 2, this.h / 2 * 1.10, {fill: "lightgrey", lineWidth: 5}).draw();
			
			c.globalAlpha = 1;	

		}
		
	}
	
	class Bullet extends Rectangle	{
		constructor(x, y)	{
			super(x, y, 100, 50, {fill: "orange"});
			
			this.blocked = false;
			this.totched = false;
		}
		
		render()	{
			this.draw();
			this.move(-1, 0);			
		}
	}
 
	// Ground
	let ground = new Rectangle(0, levelY, canvas.width, canvas.height - levelY, {fill: "green", lineWidth: 1});
	
	// Bullets
	let bullets = [];
	setInterval(function()	{
		bullets.push(new Bullet(canvas.width, 450));
	}, 4000);
	
	// Player
	let player = new Player(300, 300, 75, levelY - 300, {fill: "pink", lineWidth: 5});
	
	// Pausing functionality
	let pause = new Image("https://img.icons8.com/ios/1600/circled-pause.png", 0, 0, 100, 100);
	
	
	
	// Events
	clicked = () =>	{
		player.shielded = true;
		
		// PAUSING THE GAME
		if (pause.clicked())	{
			if (!paused)	{
				paused = true;
				pause.src = "https://image.spreadshirtmedia.com/image-server/v1/mp/designs/1010804667,width=178,height=178/fun-play-button-icon.png";
				setTimeout(stopAnimation, 100);				
			} else	{
				paused = false;
				pause.src = "https://img.icons8.com/ios/1600/circled-pause.png";
				resumeAnimation();				
			}
		}
	}
	
 
	function render()	{ 
 
		// Draw environment stuff
		ground.draw();
		
		for (let bullet of bullets)	{
			if (bullet == undefined)	{
				continue;
			}
			
			let cond = player.w;
			
			if (player.shielded)	{
				cond = (player.h * 1.10) / 2;			// Shield's diameter
			}
			
			if (distance(bullet.x, bullet.y, player.x, bullet.y) < cond)	{
				if (player.shielded)	{
					bullet.blocked = true;
				} else	{
					bullet.totched = true;
				}
			}
		}
		
		for (let i = 0; i < bullets.length; i++)	{
			if (bullets[i] == undefined)	{
				continue;
			}
			
			if (bullets[i].blocked)	{
				delete bullets[i];
				player.shieldHp -= damage;
			} else	if (bullets[i].totched)	{
				delete bullets[i];
				player.hp -= damage;
			}
			
			if (bullets[i] != undefined)	{
				bullets[i].render();
			}			
		}
		
		
		// Player related stuff
		player.draw();
		player.hpBar();
		
		if (player.shielded && player.shieldHp > 0)	{
			player.shield();
		}
		
		// Drawing the pause image
		pause.draw();
	}
