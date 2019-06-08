/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on the buy items menu
 * 
 *
 */
 
	// For item shop window
	let itemsMenuWindow = new Window(400, 100, 1150, 750, "Item shop");
	let pageNumber = 0;
	
	// Buttons
	let leftButton;
	let rightButton;

	// For patch note window
	let patchNoteWindow = new Window(400, 100, 1150, 750, "Patch note");
 
	function showItemsMenu()	{
		
		// Main window
		let windowPos = {
			x: itemsMenuWindow.x, 
			y: itemsMenuWindow.y,
			w: itemsMenuWindow.w,
			h: itemsMenuWindow.h
		};

		
		// left and right buttons (to navigate pages)
		leftButton = new Circle(windowPos.x + windowPos.w - 30, windowPos.y + windowPos.h / 2, 20, {fill: "#121212"});
		leftButton.draw();
		new Text(">", windowPos.x + windowPos.w - 40, windowPos.y + windowPos.h / 2 + 10, {fill: "white", size: 32, font: "Arial"}).draw();		
		


		rightButton = new Circle(windowPos.x + 30, windowPos.y + windowPos.h / 2, 20, {fill: "#121212"});
		rightButton.draw();
		new Text("<", windowPos.x + 20, windowPos.y + windowPos.h / 2 + 10, {fill: "white", size: 32, font: "Arial"}).draw();

		
		// Drawing items
		let relativePos = {
			x: windowPos.x + 60,
			y: windowPos.y + 70
		};
		
		
		for (let i = (pageNumber) * 6; i < (pageNumber * 6) + 6; i++)	{
			
			if (allItmes[i] != undefined || allItmes[i] != null)	{
			
				// Main container
				let mainRect = new Rectangle(relativePos.x, relativePos.y, 500, 200, {stroke: "#121212", fill: "white"});
				mainRect.draw();

				new Image(allItmes[i].img, relativePos.x + 20, relativePos.y + 20, 100, 100, allItmes[i].name).draw();
				new Text(allItmes[i].name + " :", relativePos.x + 150, relativePos.y + 40, {size: 26, font: "Times New Roman", fill: "black"}).draw();

				let mainText = new MultiLineText(allItmes[i].description, relativePos.x + 150, relativePos.y + 65, mainRect.w - 150, {size: 16, font: "Times New Roman", fill: "black"});
				mainText.draw();

				new Image("Data/Images/gold.png", relativePos.x + 20, relativePos.y + 150, 30, 30, "item_shop_gold_icon").draw();
				new Text(allItmes[i].cost, relativePos.x + 70, relativePos.y + 180, {size: 26, font: "Times New Roman", fill: "black"}).draw();
				
				// Buy button
				let buyButtonColor = "rgba(18, 18, 18, 1)";
				let sellButtonColor = "rgba(18, 18, 18, 1)";
				
				
				let buyButtonTemp = new Rectangle(relativePos.x + 350, relativePos.y + 150, 140, 40, {fill: buyButtonColor, stroke: buyButtonColor});				
				let buyText = new Text("Buy", buyButtonTemp.x + 40, buyButtonTemp.y + 30, {fill: "white", size: 30, font: "Arial"});
				
				buyButtonTemp.action = `buyItem(player, allItmes[i])`;
				
				if (buyButtonTemp.clicked())	{
					eval(buyButtonTemp.action);
				}

				// Sell button
				let sellButtonTemp = new Rectangle(relativePos.x + 190, relativePos.y + 150, 140, 40, {fill: sellButtonColor, stroke: sellButtonColor});				
				let sellText = new Text("Sell", sellButtonTemp.x + 40, sellButtonTemp.y + 30, {fill: "white", size: 30, font: "Arial"});
				
				sellButtonTemp.action = `sellItem(player, allItmes[i])`;
				
				if (sellButtonTemp.clicked())	{
					eval(sellButtonTemp.action);
				}
				
				/* Drawing the sell and buy Button */
				// Checking if the item is owned is the player
				if (allItmes[i].ownedByPlayer)	{
					sellButtonTemp.draw();
					sellText.draw();
				} else	{
					buyButtonTemp.draw();
					buyText.draw();
				}			
				
				
				relativePos.y += 220;
				if (relativePos.y + 100 > windowPos.h + windowPos.y)	{
					relativePos.y = windowPos.y + 70;
					relativePos.x += 520;
				}
			
			}
			
		}
		
		// Patch note button
		const PATCHNOTEBUTTON = new Text("View patch note", windowPos.x + 20, windowPos.y + windowPos.h - 15, {font: "Arial", size: 18, fill: "blue"});
		PATCHNOTEBUTTON.draw();
		if (PATCHNOTEBUTTON.clicked())	{
			patchNoteWindow.open();
			itemsMenuWindow.opened = false;
		}
		
	}	


	function showPatchNotes()	{

		const iframe = document.getElementById("patchnotes");

		// Chaning the iframe position to match the window
		iframe.style.display = "block";
		iframe.style.left = patchNoteWindow.x;
		iframe.style.top = patchNoteWindow.y + 100;

	}


	