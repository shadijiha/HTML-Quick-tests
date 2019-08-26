/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on events listeners
 * 
 *
 */
 
	let dragged = false;
	let toggleExtendedStats = false;
	let pingMode = false;

	/* Putting a cooldown on player's attack */
	let basicAttackCooldown = 0;
	setInterval(function()	{
		if (basicAttackCooldown > 0)	{
			basicAttackCooldown -= 500;			
		}
	}, 500);
	
	// Resizing canvas
	resized = function()    {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	window.onkeyup = function(event)	{
		if (event.keyCode == 87)	{
			player.jump();

			// Record replay
			replay.push({
				action: `player.jump()`,
				timeStamp: time
			});

		} else if (event.keyCode == 32)	{
			// Attacking if the basic attack is not on cooldown
			if (basicAttackCooldown <= 0)	{
				player.shoot(player.shootImage);
				basicAttackCooldown = player.attackSpeed * 1000;
				new Ability(0432, player.attackSpeed, "Data/Images/Long_Staff_item.png", player, `This unit cannot attack <br /><br />Source: ${player.name}`, 1050);

				// Record replay
				replay.push({
					action: `player.shoot(player.shootImage)`,
					timeStamp: time
				});

			}
		} else	if (event.keyCode == settings.extendedStats.charCodeAt(0))	{
			toggleExtendedStats = false;
		}  else	if (event.keyCode == settings.pingKey.charCodeAt(0) || event.keyCode == settings.pingKey2.charCodeAt(0))	{
			pingMode = false;
		}
	}
	
	
	window.onkeydown = function(event)	{
		switch(event.keyCode)	{
			case 68:
				moveWorld(-player.ms);
				break;
			case 65:
				if (world.virtualPosition > -650)	{
					moveWorld(player.ms);
				}
				break;
			case settings.extendedStats.charCodeAt(0):
				toggleExtendedStats = true;
				break;
			case settings.pingKey.charCodeAt(0):
				pingMode = true;
				break;
			case settings.pingKey2.charCodeAt(0):
				pingMode = true;
				break;
		}

	}

	window.onkeypress = function(event)	{

		switch(event.which)	{
			case 13:

				document.getElementById("chat").style.display = "block";
				document.getElementById("chatInput").style.display = "block";
				document.getElementById("chatInput").focus();

				if (document.getElementById("chatInput").value != "")	{
					document.getElementById("chat").innerHTML += `<br /><span class="ally">[All] ${player.name} (Player):</span> ${filter(document.getElementById("chatInput").value)}`;
					document.getElementById("chatInput").value = "";
				}
				break;

			case 82:
				//if (!player.ultActive)	{
					player.ult();
				//}
				break;
		}

	}
	
    	window.onmousedown = () =>	{
     	dragged = true;
    	}	

    	window.onmouseup = () =>	{
     	dragged = false;
   	}

	
	clicked = () =>	{
		
		// Pausing
		if (pauseButton.clicked())	{
			if (!paused)	{
				pauseButton.src = "Data/Images/playButton.png";
				paused = true;
				setTimeout(stopAnimation, 100);
			} else	{
				paused = false;
				pauseButton.src = "Data/Images/pauseButton.png";
				resumeAnimation();
			}
		}

		// Showing settings
		if (settingsButton.clicked())	{
			if (!settingsWindow.opened)	{
				settingsWindow.open();
			}
		}
		
		// Showing the items shop menu
		if (goldDisplay.clicked())	{
			itemsMenuWindow.open();
		}
		
		// Navigating the item shop menu
		if (leftButton != undefined && leftButton.clicked() && pageNumber < allItmes.length / 6)	{
			pageNumber++;		
		}
		
		if (rightButton != undefined && rightButton.clicked() && pageNumber > 0)	{	
			pageNumber--;			
		}

		/* Ping stuff */
		checkChatPing();
		//document.getElementById("chatInput").style.display = "none"; // Hiding the chat text box

	}
  
 


	