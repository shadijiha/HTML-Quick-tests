/*** 
 * 
 * Secondery JavaScript file for "Canvas viewpoint test" project 
 * 
 * 
 * This file displays the HUD of the game
 *
 */
 
	// Reserved space
	let hudProperties = {
		x: canvas.width / 2 - 700 / 2,
		y: 650,
		w: 700,
		h: canvas.height - 650
	};
		
	let hudZone = new Rectangle(hudProperties.x, hudProperties.y, hudProperties.w, hudProperties.h, {fill: "lightgrey", stroke: "black", lineWidth: 3});
	
	let itemPosution = {
		x: hudProperties.x,
		y: hudProperties.y + 10
	};
	
	let itemsRendring = [];
	
	for (let allItem of allItems)	{
		let temp = new Rectangle
	}