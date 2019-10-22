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
	let reward = 300;

	const WSCALE = 1;
	const HSCALE = 0.98;

	function globalLevelUp()	{
		level++;											// Increasing level
		player.gold += floor(reward * 3.333334);				// Adding gold to the player after wining level
		moveWorld(totalMovedAmount);							// Moving world back to beginning
		totalMovedAmount = 0;
		player.levelUp();									// Leveling up the player's base stats
		eval(`loadLevel${level}()`);							// Loading the next level
		updateMonsterAttackCooldownArray();					// update Monster Basic attack Cooldown Array
					
		//chat(`<br /><br />${shadoName} has reached level ${level} POGGERS`);	// Chatting

	}

	function globalLevelDown()	{
		level--;											// Increasing level
		//player.gold -= reward * 10;							// Adding gold to the player after wining level
		moveWorld(totalMovedAmount);							// Moving world back to beginning
		totalMovedAmount = 0;
		//player.levelUp();									// Leveling up the player's base stats
		eval(`loadLevel${level}()`);							// Loading the next level
		updateMonsterAttackCooldownArray();					// update Monster Basic attack Cooldown Array

					
		//chat(`<br /><br />${shadoName} has reached level ${level} POGGERS`);				// Chatting
	}

	c.scale(WSCALE, HSCALE);
	
	function render()	{

		
	
		// Drawing world
		ground.draw();
		castle.draw();

		time++;

		// Render any temporary objects
		for (let element of tempRenderer)	{
			if (element.draw)	{
				element.draw();
			}
		}

		// Update player name
		//player.name = shadoName;

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
	}

	