/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on bullets
 * 
 *
 */
 
 
	let bulletsArray = [];
	
	setInterval(function()	{
		if (!paused)	{
			bulletsArray.push(new Rectangle(canvas.width - 150, world.level - 100, 100, 50, {fill: "orange", stroke: "black", lineWidth: 2}));
		}
	}, 5000);

	
	/* Collision */
	function collision(objA, objB)	{
		if ( (objA.x + objA.w >= objB.x) && (objA.x <= objB.x + objB.w) && (objA.y + objA.h >= objB.y) && (objA.y <= objB.y + objB.h) )	{
			return true;
		} else	{
			return false;
		}
	}
	