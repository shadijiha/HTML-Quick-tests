/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on events listeners
 * 
 *
 */
 
	let dragged = false;
	
	let testBulletNumber = 0;
	
	// Resizing canvas
	resized = function()    {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	window.onkeyup = function(event)	{
		if (event.keyCode == 87)	{
			player.jump();
		}
	}
	
	
	window.onkeydown = function(event)	{
		switch(event.keyCode)	{
			case 68:
				moveWorld(-player.ms);
				break;
			case 65:
				moveWorld(player.ms);
				break;
			case 32: 
				player.shoot("weapon");
				testBulletNumber++;
				console.log(testBulletNumber * player.ad);
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
		
		// Showing the items shop menu
		if (goldDisplay.clicked())	{
			itemsMenuWindow.opened = true;
		}
		
		// Navigating the item shop menu
		if (leftButton != undefined && leftButton.clicked() && pageNumber < allItmes.length % 6)	{
			pageNumber++;
		}
		
		if (rightButton != undefined && rightButton.clicked() && pageNumber > 0)	{
			pageNumber--;
		}
	}
  
 


	