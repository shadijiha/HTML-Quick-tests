/***
 * This JavaScript file draws the current level
 */


	// Loading the game for the first time
	loadLevel1();

	// Setting an array to store all the Basic attack cooldowns for monsters
	let monsterAttackCooldown = [];
	function updateMonsterAttackCooldownArray()	{

		monsterAttackCooldown = [];
		for (let i = 0; i < monsters.length; i++)	{
			monsterAttackCooldown[i] = 0;
		}
		
	}
	updateMonsterAttackCooldownArray();

	// Reducing the Monster Basic attack cooldown
	setInterval(function()	{
		for (let i = 0; i < monsterAttackCooldown.length; i++)	{
			if (monsterAttackCooldown[i] > 0)	{
				monsterAttackCooldown[i] -= 100;			
			}
		}
	}, 100);

	function drawLevel()	{

		player.distanceFromObjects = [];
	
		for (let monster of monsters)	{

			// Making monster shoot
			if (monsterAttackCooldown[monsters.indexOf(monster)] <= 0 && !paused && player.hp > 0)	{
				monster.shoot(monster.shootImage);
				monsterAttackCooldown[monsters.indexOf(monster)] = monster.attackSpeed * 1000;
				new Ability(8246, monster.attackSpeed, "Data/Images/Long_Staff_item.png", monster, `This unit cannot attack <br /><br />Source: ${monster.name}`, 1050);
			}

			// Detecting if any monster is clicked to draw his HUD	
			if (monster.clicked())	{
				lastClickedHudShow = monster;
			}

			// Killing monster
			if (monster.hp <= 0)	{

				// Taking in chat
				var messages = ["Nice shot!", "Well played!", "Lucky Kappa :/", "Why me PepeHands", `Only ${floor(monster.lastDamageTaken)} damage 4Head`, "Walked into it :/"];
				monsterSendChat(monster, messages[random(0, messages.length, true)]);

				deadUnits.push(monster);

				monsters.splice(monsters.indexOf(monster), 1);
				monsterskilled++;
				player.gold += reward;

				// Showing the +gold to the player
				player.info.push(new Info(monster, {value: reward, color: "yellow", image: "Data/Images/gold.png"}));
				
				continue;
			}

			// Drawing monster
			if (settings.showMonsterHpBar)	{
				monster.showHpBar(monster.x, monster.y - 30, monster.w, 20);
			}

			if (settings.showMonsterEnergyBar)	{
				monster.showEneryBar(monster.x, monster.y - 5, monster.w, 5, false, 2);
			}
			
			// Updating monster
			monster.update();

			// Drawing range
			if (settings.showMonsterRange)	{
				showRange(monster, settings.monsterRangeColor, settings.monsterRangeOpacity);
			}
			
			/*******************************************
		 	********** Damage and collisions ***********
			*******************************************/	
			// Detect collision (monster's bullets with player)
			for (let bullet of monster.shootArray)	{				
				// removing bullet when collision and damaging player
				if (collision(player, bullet) && !player.untagetable)	{
					player.damage(monster);
					monster.shootArray.splice(monster.shootArray.indexOf(bullet), 1);

					player.lastDamageTakenFrom = monster; // For chat GG

					// Applying items effects see "items.js"
					applyItemsEffects(monster, player);

				}
			}

			// Detect collision (Player's bullets with monster)
			for (let bullet of player.shootArray)	{
				
				// Bot
				if (!monster.untagetable && distance(bullet.x, bullet.y, monster.x, bullet.y) <= 150)	{
					monster.jump();
				}

				if (collision(monster, bullet) && !monster.untagetable)	{
					monster.damage(player);
					player.shootArray.splice(player.shootArray.indexOf(bullet), 1);
					player.gold += reward / 10;
	
					// Applying items effects see "items.js"
					applyItemsEffects(player, monster);
				}
			}
			
			// Detecting of player has collided with monster
			if (collision(player, monster) && !player.untagetable && !monster.untagetable)	{
				player.damage(monster);
				applyItemsEffects(player, monster);
				moveWorld(monster.w + 20);
			}
			
			/*******************************************
		 	************ Storing distances *************
			*******************************************/
			// Storing distances between player and all monsters
			const TEMPDIST =  distance(player.x, player.y, monster.x, monster.y);
			player.distanceFromObjects[monsters.indexOf(monster)] = {
				object: monster,
				distance: TEMPDIST
			};

			// Storing distance between player and monster for the monster (e.g. for frozen heart for example)
			const DISTANCEPLAYERMONSTER =  distance(player.x, player.y, monster.x, monster.y);
			monster.distanceFromObjects[0] = {
				object: player,
				distance: DISTANCEPLAYERMONSTER
			};			

		}
		
		// Drawing platformes
		for (let platforme of platformes)	{
			platforme.draw();
		}

		// Drawing loots
		for (let loot of loots)	{
			loot.update();
		}

		// Drawing decorations
		for (let decoration of decorations)	{
			decoration.draw();
		}

		// Drawing Player's ingame HUD (above him)
		if (settings.showPlayerHpBar)	{
			player.showHpBar(player.x, player.y - 30, player.w, 20);
		}
		if (settings.showPlayerEnergyBar)	{
			player.showEneryBar(player.x, player.y - 5, player.w, 5, false, 2);
		}
		// Drawing range
		if (settings.showPlayerRange )	{
			showRange(player, settings.playerRangeColor, settings.playerRangeOpacity);
		}		
	}