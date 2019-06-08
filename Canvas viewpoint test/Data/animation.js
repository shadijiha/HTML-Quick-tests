/*** 
 * 
 * Main JavaScript file for "Canvas viewpoint test" project 
 * 
 * This JavaScript file works on animation
 * 
 * THIS FILE CONTAINS THE MAIN Function animate()
 *
 */




	function render()	{
		
		// Drawing Environement
		ground.draw();
		sun.draw();
		cloud1.draw();
		testRect.draw();
		
		// Drawing gameplay
		player.draw();
		
		// Drawing utility stuff
		goldText.draw();
		
		// Drawing Hud
		hudZone.draw();
		
	}