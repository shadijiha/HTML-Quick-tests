/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on gold and items
 * 
 *
 */
 
	let hudProperties = {
		x: 500, 
		y: 800,
		w: 800,
		h: canvas.height - 800		
	};
	 
	/**************************************
	***************** GOLD ****************
	**************************************/	
	let goldDisplay = new Text(player.gold, hudProperties.x + 600, hudProperties.y + 150, {font: "Arial", size: 48, fill: "black"});
	
	setInterval(function(){
		player.gold += 1;
		
		goldDisplay.content = player.gold;
		
	}, 1000);
	
	
 
	

		
	
  	/**************************************
	***************** HUD ****************
	**************************************/
	let hudZone = new Rectangle(hudProperties.x, hudProperties.y, hudProperties.w, hudProperties.h, {fill: "lightgrey", stroke: "grey"});
	let goldIcon = new Image("data/images/gold.png", hudProperties.x + 535, hudProperties.y + 110, 50, 50, "gold_icon");
	
	// itemes slots
	let mainSlot = new Rectangle(hudProperties.x + 535, hudProperties.y + 10, 230, 95, {fill: "grey"});
	let seconderySlots = [];
	

	function drawItemSlot(obj)	{
		seconderySlots = [];
		
		let seconderySlotsPos = {
			x: mainSlot.x + 10,
			y: mainSlot.y + 5
		};
	
		for (let i = 0; i < 6; i++)	{
				let temp = new Rectangle(seconderySlotsPos.x, seconderySlotsPos.y, 65, 37, {fill: "lightgrey"});
				
				seconderySlots.push(temp);
				
				seconderySlotsPos.x += temp.w + 5;
				
				if (i == 2)	{
					seconderySlotsPos.x = mainSlot.x + 10;
					seconderySlotsPos.y += 47;
				}
		}
		
		for (let j = 0; j < obj.ownedItems.length; j++)	{
			seconderySlots[j] = new Image(obj.ownedItems[j].img, seconderySlots[j].x, seconderySlots[j].y, seconderySlots[j].w, seconderySlots[j].h, obj.ownedItems[j].name);
		}
		
	}
	

	
	
	
 
	

	