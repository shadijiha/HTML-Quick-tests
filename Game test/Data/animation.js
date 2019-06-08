/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on animation
 * 
 * THIS FILE CONTAINS THE MAIN Function animate()
 *
 */

	let lastClickedHudShow = player;
	let reward = player.ad;

	function globalLevelUp()	{
		level++;											// Increasing level
		player.gold += reward * 10;							// Adding gold to the player after wining level
		moveWorld(world.width - 2 * (canvas.width / 3));	// Moving world back to beginning
		player.levelUp();									// Leveling up the player's base stats
		eval(`loadLevel${level}()`);						// Loading the next level
		updateMonsterAttackCooldownArray();					// update Monster Basic attack Cooldown Array

					
		chat(`<br /><br />You reached level ${level} POGGERS`);				// Chatting
	}

	function globalLevelDown()	{
		level--;											// Increasing level
		//player.gold -= reward * 10;							// Adding gold to the player after wining level
		moveWorld(world.width - 2 * (canvas.width / 3));	// Moving world back to beginning
		//player.levelUp();									// Leveling up the player's base stats
		eval(`loadLevel${level}()`);						// Loading the next level
		updateMonsterAttackCooldownArray();					// update Monster Basic attack Cooldown Array

					
		chat(`<br /><br />You reached level ${level} POGGERS`);				// Chatting
	}
	
	function render()	{
	
		// Drawing world
		ground.draw();
		sun.draw();
		castle.draw();


		time++;
		
		for (let cloud of clouds)	{
			cloud.draw();
		}

		// Update player name
		player.name = shadoName;

		/********************************************
		 **************** Level Drawing *************
		****************************************** */
		// Draw level		
		drawLevel();
		
		// Changing level
		if (collision(player, castle))	{
			globalLevelUp();
		}

		/********************************************
		 **************** Player Drawing *************
		****************************************** */
		player.update();

		reward = player.ad;	
			
		/********************************************
		 **************** Hud Drawing ***************
		****************************************** */				
		// Applying all items buff to monsters and player
		applyBuffsToAllItems(player);
		for (let monster of monsters)	{
			applyBuffsToAllItems(monster);
		}

		// Detecting if player is clicked to draw his HUD	
		if (player.clicked())	{
			lastClickedHudShow = player;
		}

		// Drawing the last clicked object's HUD
		if (settings.showFullHUD)	{
			showHud(lastClickedHudShow);
		}

		// Drawing the minimap
		if (settings.showMiniMap)	{
			progressMeter();			
		}
				
		/*******************************************
		************** Drawing window **************
		*******************************************/	
		for (let temp of allWindows)	{
			if (temp.opened)	{
				if (temp.onopen != undefined)	{
					temp.draw();
					temp.onopen();	
					temp.openExecuted = true;				
				} else	{
					console.log(`Error! "${temp.title}" window onopen() function is undefined.`);
				}
			} else	{
				if (temp.openExecuted)	{
					temp.onclose();
					temp.openExecuted = false;	
				}
			}
		}

		/*******************************************
		 ** Ckecking if the game has ended or not **
		 ******************************************/		
		endGame();
		
		// Drawing pause button
		pauseButton.draw();

		// Drawing settings button
		settingsButton.draw();


		/**********************************
		 ********** Calculating fps *******
		 *********************************/
		if (settings.showFPS)	{
			FPS = Math.floor(1 / ((performance.now() - TIME1) / 1000));
			TIME1 = performance.now();
			window.fpsText = new Text(`Framerate: ${FPS}`, 170, 50, {size: 28, font: "Arial", fill: "black"});	// Drawing fps text
			fpsText.draw();

			// Detecting canvas average framerate (for cooldowns, etc)
			if (allFps.length <= 500)	{
				allFps.push(FPS);
				CANVASFPS = detectFramerate();
			}


		}
		window.levelText = new Text(`level: ${level}`, 400, 50, {size: 28, font: "Arial", fill: "black"});		
		levelText.draw();

		// Replay
		if (replayMode)	{

			if (!window.firstTimeReplaySet)	{
				window.actions = [];
				window.times = [];
				time = 0;
				moveWorld(totalMovedAmount);

				for (let temp of replay)	{
					window.actions.push(temp.action);
					window.times.push(temp.timeStamp);
				}

				window.firstTimeReplaySet = true;

			}

			if (window.times[0] == time)	{
				eval(window.actions[0]);
				window.times = window.times.splice(1);
				window.actions = window.actions.splice(1);
			}
		}
	}

	