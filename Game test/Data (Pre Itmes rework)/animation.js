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
 
	function render()	{ 
 
		// Drawing world
		ground.draw();
		sun.draw();
		
		for (let cloud of clouds)	{
			cloud.draw();
		}
		
		// Drawing player
		new Image(player.profile, player.x, player.y, player.w, player.h, "myPlayerImage").draw();
		player.update();

		// Drawing Hud
		showHud(lastClickedHudShow);


		// Draw level		
		drawLevel();
		
		// Drawing all player's shots
		for (let bullet of player.shootArray)	{
			bullet.draw();
			bullet.x += 5;
			
			for (let monster of monsters)	{
				if (collision(monster, bullet))	{
					monster.damage(player);
					player.shootArray.splice(bullet, 1);
				}
			}
		}
		
				
		// Drawing items shop
		itemsMenuWindow.draw();
		if (itemsMenuWindow.opened)	{
			showItemsMenu();
		}
		
		
		// Applying all items buff
		applyBuffsToAllItems(player);
		for (let monster of monsters)	{
			applyBuffsToAllItems(monster);
		}
		
	}

	