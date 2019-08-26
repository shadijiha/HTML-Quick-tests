/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on HUD drawing
 * 
 *
 */

  
	let hudProperties = {
		x: 500, 
		y: canvas.height * 0.82,
		w: 800,
		h: canvas.height * 0.18	
	};
		 
	/************************************
	**************** Gold ***************
	********************************** */
	let goldDisplay = new Text(floor(player.gold), hudProperties.x + 600, hudProperties.y + 160, {font: "Arial", size: 40, fill: "black"});	
	setInterval(function(){

		// Geneating +2 gold per second if game isn't paused
		if (!paused)	{
			player.gold += player.goldRegen;

			for (let monster of monsters)	{
				monster.gold += monster.goldRegen;
			}
		}
		
	}, 1000);

	/* itemes slots NOTE: if there is a bug with this return drawItemSlot(), mainSlot, goldIcon and seconderySlots[] to gold_items.js file */
	let goldIcon = new Image("data/images/gold.png", hudProperties.x + 555, hudProperties.y + 125, 40, 40, "gold_icon");
	let mainSlot = new Rectangle(hudProperties.x + 585, hudProperties.y + 10, 180, 110, {fill: "grey"});
	let seconderySlots = [];	 
 
	function drawItemSlot(obj)	{
		 seconderySlots = [];
		 
		 let seconderySlotsPos = {
			 x: mainSlot.x + 10,
			 y: mainSlot.y + 5
		 };
	 
		 for (let i = 0; i < 6; i++)	{
				 let temp = new Rectangle(seconderySlotsPos.x, seconderySlotsPos.y, 50, 50, {fill: "lightgrey"});
				 
				 seconderySlots.push(temp);
				 
				 seconderySlotsPos.x += temp.w + 5;
				 
				 if (i == 2)	{
					 seconderySlotsPos.x = mainSlot.x + 10;
					 seconderySlotsPos.y += 47;
				 }
		 }
		 
		 for (let j = 0; j < obj.ownedItems.length; j++)	{
			 seconderySlots[j] = new Image(obj.ownedItems[j].img, seconderySlots[j].x, seconderySlots[j].y, seconderySlots[j].w, seconderySlots[j].h, obj.ownedItems[j].name);


			 // Showing item description if hovered
			 if (seconderySlots[j].hover())	{
				loadItmes(obj);
				showDescription(obj.ownedItems[j].description);
			 }
		 }
		 
	}

	/* Show HUD */
	function showHud(obj)	{
		
		let hudZone = new Rectangle(hudProperties.x, hudProperties.y, hudProperties.w, hudProperties.h, {fill: "lightgrey", stroke: "grey"});

		// Hiding all previous descrpition
		hideDescription();
		
		// Showing more stats if C is pressed
		if (toggleExtendedStats)	{
			showRange(obj, settings.playerRangeColor, settings.playerRangeOpacity);
			showExtendedStats(obj);
		}
		
		// Drawing the zone
		c.globalAlpha = 0.7;		
		hudZone.draw();
		c.globalAlpha = 1;
		
		// drawing the gold and the items slots
		goldDisplay.content = floor(obj.gold);
		goldDisplay.draw();
		goldIcon.draw();
		mainSlot.draw();		
		
		for (let seconderySlot of seconderySlots)	{
			seconderySlot.draw();
		}
		
		drawItemSlot(obj);
				
		// Drawing object cooldowns
		for (let coolDown of obj.coolDowns)	{
			coolDown.draw();
		}
		
		// Drawing object hp and energy
		obj.showHpBar(hudZone.x + 20, hudZone.y + 20, 450, 50, true);
		obj.showEneryBar(hudZone.x + 20, hudZone.y + 85, 450, 50, true);
		
		
		/*** 
		 *  Drawing the stats section
		 */
		c.globalAlpha = 0.7;
		new Rectangle(hudZone.x - 240, hudZone.y, 240, hudZone.h, {fill: "grey"}).draw();
		c.globalAlpha = 1;
		
		new Image(obj.profile, hudZone.x - 220, hudZone.y + 20, 50, 100, "tempProfile").draw();
		
		// Getting stats for the stats display
		let stats = [`${floor(obj.lifeSteal * 100)}%`, floor(obj.ad), floor(obj.armor), `${floor(obj.lithality)} | ${floor(obj.armorPen * 100)}%`, floor(obj.range), `${floor(obj.critChance * 100)}%`];
		
		// Getting image sources for the stats display
		let imgSrc = ["lifeSteal", "attack_damage", "armor", "armorPen", "range", "crit"];
		let names = ["lifesteal", "attack Damage", "armor", "armor penetration", "range", "critical strike chance"];

		// Description for the stats display
		let des = [
					`This unit restores <green> ${floor(obj.lifeSteal * 100)}% </green> (${floor(obj.baseLifeSteal * 100)}% + ${floor(obj.bonusLifeSteal * 100)}%) of the damage dealt as health. This unit has restored a total of <green> ${floor(obj.healing)} </green> health from its life steal.`, 
					`This unit has <orange> ${obj.ad} </orange> (${obj.baseAD} + ${obj.bonusAD}) attack damage. This unit has dealt a total of <orange> ${floor(obj.totalDamageDealth)} </orange> damage to enemies`, 
					`This unit has ${floor(obj.armor)} (${floor(obj.baseArmor)} + ${floor(obj.bonusArmor)}) takes ${floor(obj.armor / (100 + obj.armor) * 100)}% reduced damage. This unit has avoided <purple> ${floor(obj.damageAvoided)} </purple> damage.`, 
					`This unit ignores ${obj.armorPen * 100}% and ${obj.lithality} of target's armor. This unit has dealt <orange> ${floor(obj.bonusDamageDealt)} </orange> bonus damage by penetrating target's armor`,
					"Range",
					`This unit can critical strike for a maximum of <orange> ${floor(obj.ad * obj.critMultiplier)} </orange> damage on ${floor(obj.critChance * 100)}% of its attacks`
		];

		// This array stores imaginary rectangles that trigger Description display on hover
		window.holders = [];
		
		// Positions for the stats images, holders, etc
		let tempPos = {
			x: hudZone.x - 160, 
			y: hudZone.y + 20,
			w: 70,
			h: 50
		}
		
		// Displaying all stats of "stats" array
		for (let i = 0; i < stats.length; i++)	{
			let icon = new Image(`Data/Images/${imgSrc[i]}.png`, tempPos.x, tempPos.y, 20, 20, imgSrc[i]);
			icon.draw();
			
			let value = new Text(stats[i], tempPos.x + 25, tempPos.y + 16, {size: 16, font: "Arial", fill: "black"});
			value.draw();

			let placeholder = new Rectangle(tempPos.x, tempPos.y, value.width + icon.w, value.height, {fill: "red", stroke: "black", lineWidth: 1});
			placeholder.statName = names[i];
			placeholder.statValue = stats[i];
			placeholder.objectName = obj;
			holders.push(placeholder);
			
			tempPos.x += tempPos.w;
			if (tempPos.x > hudZone.x - 30)	{
				tempPos.x = hudZone.x - 160;
				tempPos.y += tempPos.h;
			}
			
			
		}

		// triggering Description on hover
		for (let j = 0; j < holders.length; j++)	{
			if (holders[j].hover())	{
				showDescription(des[j]);
			}
		}
		
	}

	// Extended stats function (when C is pressed)
	function showExtendedStats(obj)	{
	
		/*** 
		 *  Drawing the stats section
		 */
		c.globalAlpha = 0.7;
		new Rectangle(hudProperties.x - 240, hudProperties.y - hudProperties.h, 240, hudProperties.h, {fill: "grey", stroke: "grey", lineWidth: 1}).draw();
		c.globalAlpha = 1;
		
		new Image(obj.profile, hudProperties.x - 220, hudProperties.y + 20, 50, 100, "tempProfile").draw();
		
		// Getting stats for the stats display
		let stats = [`${obj.ms}`, `${(1 / obj.attackSpeed).toFixed(2)}`];
		
		// Getting image sources for the stats display
		let imgSrc = ["ms", "attack_speed"];
		let names = ["mouvement speed", "attack speed (seconds cooldown / attack)"];

		// Description for the stats display
		let des = [
					`This unit has ${obj.ms} mouvement speed`, 
					`This unit has ${(obj.attackSpeed).toFixed(2)}. This unit does ${(1 / obj.attackSpeed).toFixed(2)} attack(s) per second`
		];

		// This array stores imaginary rectangles that trigger Description display on hover
		let holders = [];
		
		// Positions for the stats images, holders, etc
		let tempPos = {
			x: hudProperties.x - 160, 
			y: hudProperties.y + 20 - hudProperties.h,
			w: 70,
			h: 50
		}
		
		// Displaying all stats of "stats" array
		for (let i = 0; i < stats.length; i++)	{
			let icon = new Image(`Data/Images/${imgSrc[i]}.png`, tempPos.x, tempPos.y, 20, 20, imgSrc[i]);
			icon.draw();
			
			let value = new Text(stats[i], tempPos.x + 25, tempPos.y + 16, {size: 16, font: "Arial", fill: "black"});
			value.draw();

			let placeholder = new Rectangle(tempPos.x, tempPos.y, value.width + icon.w, value.height, {fill: "red", stroke: "black", lineWidth: 1});
			placeholder.statName = names[i];
			placeholder.statValue = stats[i];
			placeholder.objectName = obj;
			holders.push(placeholder);
			
			tempPos.x += tempPos.w;
			if (tempPos.x > hudProperties.x - 30)	{
				tempPos.x = hudProperties.x - 160;
				tempPos.y += tempPos.h;
			}
			
			
		}

		// triggering Description on hover
		for (let j = 0; j < holders.length; j++)	{
			if (holders[j].hover())	{
				showDescription(des[j]);
			}
		}			

	}

	/* Progress Map */
	function progressMeter()	{

		// Main meter
		window.mainMeter = new Meter((world.virtualPosition + canvas.width / 3) / world.width, canvas.width / 2 - 300, 60, 600);
		mainMeter.draw();

		// Player's position and HUD drawing when clicked
		const PLAYERIMAGE = new Image(player.profile, mainMeter.x + mainMeter.barWidth - 12, mainMeter.y - 50, 25, 50, "myPlayerImage");
		PLAYERIMAGE.draw();

		if (PLAYERIMAGE.clicked())	{
			lastClickedHudShow = player;
		}

		// End line image
		new Image("Data/Images/finish-flags-icon.png", mainMeter.x + mainMeter.w - 20, mainMeter.y - 30, 40, 30).draw();

		// Monster positions and HUD drawing when clicked
		for (let monster of monsters)	{

			let PERCENTAGE = mainMeter.w / world.width;

			const MONSTERIMAGE = new Image(monster.profile, mainMeter.x + (monster.initialX * PERCENTAGE), mainMeter.y - 30, 15, 30, "myMonsterImage");
			MONSTERIMAGE.draw();

			// Allowing clicking on minimap monsters to view their HUD
			if (MONSTERIMAGE.clicked())	{
				lastClickedHudShow = monster;
			}

		}

	}

	/* Game end */
	let deathCapWindow = new Window(400, 100, 1150, 750, "Death recap");

	function endGame()	{
		if (player.hp <= 0)	{

			// Setting global variable to end
			gameOver = true;

			// Send in chat
			if (!window.messageSent)	{
				monsterSendChat(player.lastDamageTakenFrom, "Good game!");
				window.messageSent = true;
			}

			// Setting all variables to neutral
			player.hpRegen = 0;
			player.hp = 0;
			player.ad = 0;
			player.goldRegen = 0;
			//player.immute = true;
			
			// Displaying "Game Over"
			new Text("Game Over", canvas.width / 4, canvas.height / 2, {font: "Arial", size: 200, fill: "red"}).draw();


			/** Display death recap */ 

			// Main clickable thing
			let deathRecapMin = new Rectangle(canvas.width / 2 - 250, 150, 500, 30, {fill: "rgba(0, 0, 0, .8)", stroke: "white", lineWidth: 1});
			deathRecapMin.draw();
			new Text("Click for dealth recap", deathRecapMin.x + 175, deathRecapMin.y + 18, {size: 16, font: "Arial", fill: "white"}).draw();
			
			// Main window
			if (deathRecapMin.clicked())	{
				deathCapWindow.open();
			} else	{
				deathCapWindow.close();
			}

			if (deathCapWindow.opened)	{

				// Drawing icons
				let relativePos = {
					x: deathCapWindow.x + 60,
					y: deathCapWindow.y + 100
				};

				var TOTALDMG = 0;


				for (let element of player.dealthRecap)	{

					// Finding the sum of all damage taken

					TOTALDMG = 0;
					for (let x of player.dealthRecap)	{
						TOTALDMG += x.damageTaken;
					}

					let currentPercentage = element.damageTaken / TOTALDMG * 100;
					let image = "Data/Images/Long_Staff_item.png";

					for (let allItme of allItmes)	{
						if (element.source.toLowerCase() == allItme.name.toLowerCase())	{
							image = allItme.img;
							break;
						}
					}


					// Main container
					let mainRect = new Rectangle(relativePos.x, relativePos.y, 500, 180, {stroke: "#121212", fill: "white"});
					mainRect.draw();

					new Image(image, relativePos.x + 20, relativePos.y + 20, 100, 100, image).draw();
					new Text(element.source + " :", relativePos.x + 150, relativePos.y + 40, {size: 26, font: "Times New Roman", fill: "black"}).draw();

					let mainText =	new MultiLineText(
										`${floor(element.damageTaken)} <black> ${element.type} </black> damage taken from ${element.source} \n \n <black> ${currentPercentage.toFixed(1)}% </black> of total damage taken`,
										 relativePos.x + 150, relativePos.y + 65, mainRect.w - 150, {size: 16, font: "Times New Roman", fill: "black"}
									);
					mainText.draw();

					new Text(floor(element.damageTaken), relativePos.x + 70, relativePos.y + 160, {size: 26, font: "Times New Roman", fill: "black"}).draw();
						
					
					relativePos.y += 220;
					if (relativePos.y > deathCapWindow.h)	{
						relativePos.y = deathCapWindow.y + 100;
						relativePos.x += 520;
					}

				}

				// Main text
				new MultiLineText(`Total damage taken: <red> ${floor(TOTALDMG)} </red> `,deathCapWindow.x + deathCapWindow.w / 3, deathCapWindow.y + 80, 600, {size: 30, font: "Arial", fill: "black"}).draw();

			}



		}
	}

	/* PINGS */
	function checkChatPing()	{

		pingInChat(fpsText, `Game's current framerate is <b>${FPS}</b>`);		// Ping FPS
		pingInChat(levelText, `The current level is <b>${level}</b>`);			// Ping level
		pingInChat(goldDisplay, `<b>${lastClickedHudShow.name}</b> has ${lastClickedHudShow.gold} gold`);			// Ping gold
		pingInChat(mainMeter, `<span class="ally">${player.name} (player)</span> is <b>${floor(mainMeter.percentage * 100)}%</b> through level ${level}`); // Ping progress
		
		pingInChat(player, `<span class="ally">${player.name} (Player)</span> 
		 has <green>${floor(player.hp / player.maxHp * 100)}%</green> health and <span style="color: #0080FF; font-weight: bold;">${floor(player.energy / player.maxEnergy * 100)}%</span> energy`); // Ping player health and energy

		 // Ping monsters health and energy
		for (let monster of monsters)	{
			pingInChat(monster, `<span class="enemy">${monster.name} (Monster)</span> 
			has <green>${floor(monster.hp / monster.maxHp * 100)}%</green> health and <span style="color: #0080FF; font-weight: bold;">${floor(monster.energy / monster.maxEnergy * 100)}%</span> energy`); 
		}

		// Ping object stats 
		for (let holder of holders)	{
			let text = "";

			if (holder.objectName.profile == player.profile)	{
				text = `<span class="ally">${holder.objectName.name} (Player)</span>`;
			} else	{
				text = `<span class="enemy">${holder.objectName.name} (Monster)</span>`;
			}

			pingInChat(holder, `${text} has ${holder.statValue} ${holder.statName} `); 
		}

		// Ping player cooldowns
		for (let cooldown of player.coolDowns)	{

			let itemname = "";

			for (let allItme of allItmes)	{
				if (allItme.img == cooldown.background)	{
					itemname = allItme.name;
				}
			}

			if (itemname == "")	{
				itemname = "Basic attack"
			}

			if (cooldown.type == "ability")	{
				pingInChat(cooldown.mainRect, `<span class="ally">${player.name} (Player):</span> ${itemname} is cooling down. ${cooldown.remainingTime} seconds remaining`);
			} else	if (cooldown.type == "buff")	{
				pingInChat(cooldown.mainRect, `<span class="ally">${player.name} (Player):</span> ${itemname} is ready`);
			}

		}

		// Ping items
		for (let slot of seconderySlots)	{

			let text = "";

			if (lastClickedHudShow.profile == player.profile)	{
				text = `<span class="ally">${lastClickedHudShow.name} (Player)</span>`;
			} else	{
				text = `<span class="enemy">${lastClickedHudShow.name} (Monster)</span>`;
			}
			
			let itemname = "";

			if (slot.src != undefined)	{

				for (let allItme of allItmes)	{
					if (allItme.img == slot.src)	{
						itemname = allItme.name;
					}
				}

				pingInChat(slot, `${text} - ${itemname}`);
			}

		}


		// auto scroll to the bottom of chat
		const objDiv = document.getElementById("chat");
		objDiv.scrollTop = objDiv.scrollHeight;

	}
	