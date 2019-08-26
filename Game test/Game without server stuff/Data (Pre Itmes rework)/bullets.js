/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on bullets
 * 
 *
 */
	
	/* Show HUD */
	function showHud(obj)	{
		
		// pause button
		pauseButton.draw();
		
		// Drawing the zone
		c.globalAlpha = 0.7;		
		hudZone.draw();
		c.globalAlpha = 1;
		
		// drawing the gold and the items slots
		goldDisplay.draw();
		goldIcon.draw();
		mainSlot.draw();		
		
		for (let seconderySlot of seconderySlots)	{
			seconderySlot.draw();
		}
		
		drawItemSlot(obj);
		
		// Drawing object hp and energy
		obj.showHpBar(hudZone.x + 20, hudZone.y + 20, 450, 50, true);
		obj.showEneryBar(hudZone.x + 20, hudZone.y + 85, 450, 50, true);
		
		
		// Drawing the stats
		c.globalAlpha = 0.7;
		new Rectangle(hudZone.x - 220, hudZone.y, 220, hudZone.h, {fill: "grey"}).draw();
		c.globalAlpha = 1;
		
		new Image(obj.profile, hudZone.x - 200, hudZone.y + 20, 50, 100, "tempProfile").draw();
		
		let stats = [Math.floor(obj.hp), Math.floor(obj.ad), Math.floor(obj.armor), `${Math.floor(obj.armorPen * 100)}%`, (obj.hpRegen * 100).toFixed(1), `${Math.floor(obj.critChance * 100)}%`];
		let imgSrc = ["hp", "attack_damage", "armor", "armorPen", "regn", "crit"];
		let des = ["Health", "Attack damage", "Armor", "Armor penetration", "Health regenration", "Critical strick chance"];
		
		let tempPos = {
			x: hudZone.x - 140, 
			y: hudZone.y + 20,
			w: 70,
			h: 50
		}
		
		for (let i = 0; i < stats.length; i++)	{
			new Image(`Data/Images/${imgSrc[i]}.png`, tempPos.x, tempPos.y, 20, 20, imgSrc[i]).draw();
			
			new Text(stats[i], tempPos.x + 25, tempPos.y + 16, {size: 16, font: "Arial", fill: "black"}).draw();
			
			
			tempPos.x += tempPos.w;
			if (tempPos.x > hudZone.x - 10)	{
				tempPos.x = hudZone.x - 140;
				tempPos.y += tempPos.h;
			}
			
			
		}	
		
		
	}

	
	/* Collision */
	function collision(objA, objB)	{
		if ( (objA.x + objA.w >= objB.x) && (objA.x <= objB.x + objB.w) && (objA.y + objA.h >= objB.y) && (objA.y <= objB.y + objB.h) )	{
			return true;
		} else	{
			return false;
		}
	}
	