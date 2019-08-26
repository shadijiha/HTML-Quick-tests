/*** 
 * 
 * Main JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on the buy items menu
 * 
 *
 */
 
	// For item shop window
	let itemsMenuWindow = new Window(400, 100, 1150, 770, "Item shop");
	let pageNumber = 0;
	let windowElements = [];
	
	// Buttons
	let leftButton;
	let rightButton;
	var selectedItem = allItmes[0];

	// For patch note window
	let patchNoteWindow = new Window(400, 100, 1150, 750, "Patch note");

	// For settings window
	let settingsWindow = new Window(400, 100, 1150, 750, "Settings");

	// For console window
	let consoleWindow = new Window(400, 100, 1150, 750, "Console & cheats");


	itemsMenuWindow.onopen = function()	{
		if (settings.itemShopLayout == "uncompressed")	{
			document.getElementById("compressed_item_shop").style.display = "none";
			loadDefaultItemShop();
		} else if (settings.itemShopLayout == "compressed")	{
			document.getElementById("item_shop").style.display = "none";
			loadCompressedItemShop();
		}	
		
	}

	itemsMenuWindow.onclose = function()	{
		document.getElementById("item_shop").style.display = "none";
		document.getElementById("compressed_item_shop").style.display = "none";
	}

	patchNoteWindow.onopen = function()	{

		const iframe = document.getElementById("patchnotes");

		// Chaning the iframe position to match the window
		iframe.style.display = "block";
		iframe.style.left = patchNoteWindow.x;
		iframe.style.top = patchNoteWindow.y + 100;

	}

	patchNoteWindow.onclose = function()	{
		document.getElementById("patchnotes").style.display = "none";
	}

	settingsWindow.onopen = function()	{

		const MAIN = document.getElementById("settings");

		MAIN.style.display = "";
		MAIN.style.left = settingsWindow.x + 50;
		MAIN.style.top = settingsWindow.y + 50;

	}

	settingsWindow.onclose = function()	{
		document.getElementById("settings").style.display = "none";
	}

	consoleWindow.onopen = function()	{

		var MAIN = document.getElementById("console");

		if (!window.objectConsoleLoad)	{
			window.objectConsoleLoad = player.name;
		}
		
		if (!window.consoleLoaded && shadoName == "admin")	{

			// Establish select menu
			var selectObjStr = "";
			selectObjStr += `<option value="${window.objectConsoleLoad}">${window.objectConsoleLoad}</option> \n`;
			selectObjStr += `<option value="${player.name}">${player.name}</option> \n`;
			for (let i = 0; i < monsters.length; i++)	{
				selectObjStr += `<option value="${monsters[i].name}">${monsters[i].name}</option> \n`;
			}

			// Establish dead unit menu
			var deadObjStr = "";
			deadObjStr += `<option value=""></option> \n`;
			for (let i = 0; i < deadUnits.length; i++)	{
				deadObjStr += `<option value="${deadUnits[i].name}">${deadUnits[i].name}</option> \n`;
			}			

			// Find the object
			var objectToLoad;
			var variableName;
			if (window.objectConsoleLoad == player.name)	{
				objectToLoad = player;
				variableName = "player";
			} else	{
				for (let monster of monsters)	{
					if (window.objectConsoleLoad == monster.name)	{
						objectToLoad = monster;
						variableName = "monsters[" + monsters.indexOf(monster) + "]";
					}
				}
			}
			
			if (objectToLoad == undefined)	{
				for (let deadUnit of deadUnits)	{
					if (window.objectConsoleLoad == deadUnit.name)	{
						objectToLoad = deadUnit;
						variableName = "deadUnits[" + deadUnits.indexOf(deadUnit) + "]";
					}
				}					
			}

			// Establish owned items select menu
			var objectOwnedItemsStr = `<option value="none"></option> \n`;
			for (let temp of objectToLoad.ownedItems)	{
				objectOwnedItemsStr += `<option value="${allItmes.indexOf(temp)}">${temp.name}</option> \n`;
			}

			// Establish all items select menu
			var objectAllItemsStr = `<option value="none"></option> \n`;
			for (let i = 0; i < allItmes.length; i++)	{
				var temp = allItmes[i];
				objectAllItemsStr += `<option value="${i}">${temp.name}</option> \n`;
			}

			// Load death recap
			var objectDmgRecapStr = "";
			var TOTALDMG = 0;
			for (let element of objectToLoad.dealthRecap)	{

				// Finding the sum of all damage taken
				TOTALDMG = 0;
				for (let x of objectToLoad.dealthRecap)	{
					TOTALDMG += x.damageTaken;
				}

				let currentPercentage = element.damageTaken / TOTALDMG * 100;
				let image = "Data/Images/Long_Staff_item.png";
				for (let allItme of allItmes)	{
					if (element.source.toLowerCase() == allItme.name.toLowerCase())	{
						image = allItme.img;
						break;
					}
				}

				objectDmgRecapStr += `
					<tr>
						<td>
							<img src="${image}" width="50" height="50" title="${element.source}" />
						</td>
						<td>
							${element.damageTaken.toFixed(3)}
						</td>
						<td>
							${currentPercentage.toFixed(2)}%
						</td>
						<td>
							${element.type}
						</td>
					</tr>
				`;

			}

			MAIN.innerHTML = `
					<fieldset>
						<legend><h2>General options</h2></legend>
						<table>
							<tr>
								<td>
									Resume game: 
								</td>
								<td>
									<input type="button" value="Game not over" OnClick="gameOver = false; player.heal(500);" />
								</td>
							</tr>	
							<tr>
								<td>
									Change level:
								</td>
								<td>
									<input type="button" value="level up" OnClick="window.consoleLoaded = false; globalLevelUp();" />
								</td>
								<td>
									<input type="button" value="level down" OnClick="window.consoleLoaded = false; globalLevelDown();" />
								</td>
								<td>
									<input type="button" value="Level builder" OnClick="window.open('level_builder.html');" />
								</td>
							</tr>
							<tr>
								<td>
									Show hitboxes
								</td>
								<td>
									<label class="switch">
										<input type="checkbox" OnClick="changeSetting('settings.showHitBox')" />
										<span class="slider round"></span>
									</label>
								</td>
							</tr>
							<tr>
								<td>
									Alive objects:
								</td>
								<td>
									<select OnChange="window.objectConsoleLoad = this.value; window.consoleLoaded = false;">
										${selectObjStr}
									</select>
								</td>
								<td>
								<input type="button" value="Refresh" OnClick="window.consoleLoaded = false;" />
								</td>
							</tr>
							<tr>
								<td>
									Dead objects:
								</td>
								<td>
									<select OnChange="window.objectConsoleLoad = this.value; window.consoleLoaded = false;">
										${deadObjStr}
									</select>
								</td>
								<td>
								<input type="button" value="Refresh" OnClick="window.consoleLoaded = false;" />
								</td>
							</tr>					
						</table>
					</fieldset>
					<br />
					<fieldset>
						<legend><h2>Edit ${objectToLoad.name} properties</h2></legend>
						<table>
							<tr>
								<td>
									Maximum health
								</td>
								<td>
									<input type="text" value="${objectToLoad.maxHp}" OnChange="${variableName}.maxHp = Number(this.value)" />
								</td>
								<td>
									Current health
								</td>
								<td>
									<input type="text" value="${objectToLoad.hp}" OnChange="${variableName}.hp = Number(this.value)" />
								</td>
								<td>
									Health regenration
								</td>
								<td>
									<input type="text" value="${objectToLoad.hpRegen}" OnChange="${variableName}.hpRegen = Number(this.value)" />
								</td>
							</tr>
							<tr>
								<td>
									Maximum Energy
								</td>
								<td>
									<input type="text" value="${objectToLoad.maxEnergy}" OnChange="${variableName}.maxEnergy = Number(this.value)" />
								</td>
								<td>
									Current Energy
								</td>
								<td>
									<input type="text" value="${objectToLoad.energy}" OnChange="${variableName}.energy = Number(this.value)" />
								</td>
								<td>
									Energy regenration
								</td>
								<td>
									<input type="text" value="${objectToLoad.energyRegen}" OnChange="${variableName}.energyRegen = Number(this.value)" />
								</td>
							</tr>
							<tr>
								<td>
									Base armor
								</td>
								<td>
									<input type="text" value="${objectToLoad.baseArmor}" OnChange="${variableName}.baseArmor = Number(this.value)" />
								</td>
								<td>
									Bonus armor
								</td>
								<td>
									<input type="text" value="${objectToLoad.bonusArmor}" OnChange="${variableName}.bonusArmor = Number(this.value)" />
								</td>
								<td>
									Lithality
								</td>
								<td>
									<input type="text" value="${objectToLoad.lithality}" OnChange="${variableName}.lithality = Number(this.value)" />
								</td>
								<td>
									Armor penetration
								</td>
								<td>
									<input type="text" value="${objectToLoad.armorPen}" OnChange="${variableName}.armorPen = Number(this.value)" />
								</td>
							</tr>
							<tr>
								<td>
									Base attack damage
								</td>
								<td>
									<input type="text" value="${objectToLoad.baseAD}" OnChange="${variableName}.baseAD = Number(this.value)" />
								</td>
								<td>
									Bonus attack damage
								</td>
								<td>
									<input type="text" value="${objectToLoad.bonusAD}" OnChange="${variableName}.bonusAD = Number(this.value)" />
								</td>
								<td>
									Critical strike chance
								</td>
								<td>
									<input type="text" value="${objectToLoad.critChance}" OnChange="${variableName}.critChance = Number(this.value)" />
								</td>
							</tr>
							<tr>
								<td>
									Base lifesteal
								</td>
								<td>
									<input type="text" value="${objectToLoad.baseLifeSteal}" OnChange="${variableName}.baseLifeSteal = Number(this.value)" />
								</td>
								<td>
									Bonus lifesteal
								</td>
								<td>
									<input type="text" value="${objectToLoad.bonusLifeSteal}" OnChange="${variableName}.bonusLifeSteal = Number(this.value)" />
								</td>
								<td>
									Attack speed
								</td>
								<td>
									<input type="text" value="${objectToLoad.attackSpeed}" OnChange="${variableName}.attackSpeed = Number(this.value)" />
								</td>
							</tr>
							<tr>
								<td>
									Range
								</td>
								<td>
									<input type="text" value="${objectToLoad.range}" OnChange="${variableName}.range = Number(this.value)" />
								</td>
								<td>
									Mouvement speed
								</td>
								<td>
									<input type="text" value="${objectToLoad.ms}" OnChange="${variableName}.ms = Number(this.value)" />
								</td>
								<td>
									Gold
								</td>
								<td>
									<input type="text" value="${objectToLoad.gold}" OnChange="${variableName}.gold = Number(this.value)" />
								</td>
							</tr>
						</table>
						<br />
						Sell an item:
						<select OnChange="sellItem(${variableName}, allItmes[this.value]);">
							${objectOwnedItemsStr}
						</select>
						<br />
						<br />
						Buy an item:
						<select OnChange="${variableName}.gold += allItmes[this.value].cost; buyItem(${variableName}, allItmes[this.value]);">
							${objectAllItemsStr}
						</select>
						<br />
						<br />
						<input type="button" value="Toggle immute" OnClick="changeSetting('${variableName}.immute');" />
						<input type="button" value="Toggle untagetable" OnClick="changeSetting('${variableName}.untagetable');" />
						<input type="button" value="Toggle stunned" OnClick="changeSetting('${variableName}.stunned');" />
					</fieldset>
					<br />
					<fieldset>
						<legend><h2>Damage taken recap</h2></legend>
						${objectToLoad.name} has taken a total of ${TOTALDMG.toFixed(3)} damage
						<br />
						<br />
						<table border="1">
							<tr>
								<th>
									Damage source
								</th>
								<th>
									Damage taken
								</th>
								<th>
									% of total damage
								</th>
								<th>
									Damage type
								</th>
							</tr>
							${objectDmgRecapStr}
						</table>
					</fieldset>
			`;

			window.consoleLoaded = true;

		}

		MAIN.style.display = "block";
		MAIN.style.position = "absolute";
		MAIN.style.left = this.x + 50;
		MAIN.style.top = this.y + 50;

	}

	consoleWindow.onclose = function()	{

		document.getElementById("console").style.display = "none";
	}

	function loadDefaultItemShop()	{
		// Loading itemes again to refresh variables for example "... grants a shield equals to 10% (VARIABLE) of your maximum health"
		loadItmes(player);
		
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

		// Hiding the elements of the previous page (or current page to draw them again)
		hideElements(windowElements);

		// Resetting the item's window components
		windowElements = [];

		// Drawing items
		let relativePos = {
			x: windowPos.x + 60,
			y: windowPos.y + 70
		};
		
		const MAIN = document.getElementById("item_shop");		
		
		for (let i = (pageNumber) * 6; i < (pageNumber * 6) + 6; i++)	{
		
			if (allItmes[i] != undefined || allItmes[i] != null)	{

				// Nav buttons
				
				if (!document.getElementById("div" + i))	{
			
					MAIN.innerHTML += `					
					<div id="div${i}" style="border: solid #121212 2px; position: fixed; left: ${relativePos.x}px; top: ${relativePos.y}; width: 500; height: 200;">		
						<img id="${allItmes[i].name}" src="${allItmes[i].img}" style="position: absolute; left: 20; top: 20; width: 100; height: 100;"/>
						<span id="title${i}" style="position: absolute; left: 150px; top: 20px; font-size: 26px;">
							${allItmes[i].name}:
						</span>
						<br />
						<img src="Data/Images/gold.png" id="gold${i}" width="30" height="30" style="position: absolute; top: 150px; left: 20px;" />
						<span style="position: absolute; left: 60px; top: 150px; font-size: 26px;" id="cost${i}">
							${allItmes[i].cost}
						</span>
						<br />
						<div id="description${i}" class="item_description" style="left: 150px; top: 60px;">
							${allItmes[i].description}
						</div>
						<br />
						<input type="button" id="sell${i}" class="shop_button" value="Sell" OnClick="sellItem(player, allItmes[${i}])" style="left: 200px; top: 150px;" />
						<input type="button" id="buy${i}" class="shop_button" value="Buy" OnClick="buyItem(player, allItmes[${i}])" style="left: 350px; top: 150px;" />
					</div>`;
					
				}
				
				// Main <div>
				document.getElementById("div" + i).style.top = `${relativePos.y}px`;
				document.getElementById("div" + i).style.left = `${relativePos.x}px`;
				windowElements.push(document.getElementById("div" + i));
				
				document.getElementById("description" + i).innerHTML = allItmes[i].description;

				/* Displaying the sell and buy Button */
				// Checking if the item is owned is the player
				if (allItmes[i].ownedByPlayer)	{
					document.getElementById("buy" + i).style.display = "none";
					document.getElementById("sell" + i).style.display = "";
				} else if (!allItmes[i].ownedByPlayer)	{
					document.getElementById("buy" + i).style.display = "";
					document.getElementById("sell" + i).style.display = "none";
				}

				// Disable the buy button if not enough gold
				if (player.gold < allItmes[i].cost)	{
					document.getElementById("buy" + i).disabled = "disabled";
				} else	{
					document.getElementById("buy" + i).disabled = "";
				}
				
				// Adjusting positions
				relativePos.y += 220;
				if (relativePos.y + 200 > windowPos.h + windowPos.y)	{
					relativePos.y = windowPos.y + 70;
					relativePos.x += 520;
				}
			}
		
		}

		// If the item shop window is closed, setting all window elements to display: none;
		if (!itemsMenuWindow.opened)	{
			document.getElementById("item_shop").style.display = "none";
		} else	{
			document.getElementById("item_shop").style.display = "";
		}

		// Shwoing the elements of the current page
		showElements(windowElements);
		
		// Patch note button
		const PATCHNOTEBUTTON = new Text("View patch note", windowPos.x + 20, windowPos.y + windowPos.h - 15, {font: "Arial", size: 18, fill: "blue"});
		PATCHNOTEBUTTON.draw();
		if (PATCHNOTEBUTTON.clicked())	{
			patchNoteWindow.open();			// Opening patch notes window
			itemsMenuWindow.close();		// Closing item menu window
		}

		// Change the layout of the item shop
		const changeToCompressed = new Image("Data/Images/compressed_item_shop.png", PATCHNOTEBUTTON.x + 150, PATCHNOTEBUTTON.y - 30, 40, 40, "uncompressed_item_shop");
		changeToCompressed.draw();
		if (changeToCompressed.clicked())	{
			settings.itemShopLayout = "compressed";
		}
	}

	function loadCompressedItemShop()	{

		// Loading itemes again to refresh variables for example "... grants a shield equals to 10% (VARIABLE) of your maximum health"
		loadItmes(player);
		
		// Main window
		let windowPos = {
			x: itemsMenuWindow.x, 
			y: itemsMenuWindow.y,
			w: itemsMenuWindow.w,
			h: itemsMenuWindow.h
		};

		let relativePos = {
			x: windowPos.x + 50,
			y: windowPos.y + 80,
			w: 70,
			h: 70,
			paddingX: 20,
			paddingY: 40
		};

		let pannelPos = {
			x: windowPos.x + windowPos.w * 0.68,
			y: relativePos.y,
			w: windowPos.w * 0.3,
			h: windowPos.h * 0.8
		};

		for (let item of allItmes)	{

			const icon = new Image(item.img, relativePos.x, relativePos.y, relativePos.w, relativePos.h, item.img);
			const goldICO = new Image("Data/Images/gold.png", icon.x, icon.y + icon.h + 5, 20, 20, "gold");
			const costTXT = new Text(item.cost, icon.x + 25, icon.y + icon.h + 20, {size: 20, fill: "black"}); 

			icon.draw();
			goldICO.draw();
			costTXT.draw();

			// Show item on pannel when clicked
			if (icon.clicked())	{
				selectedItem = item;
			}

			// Show item name when hovered
			if (icon.hover())	{
				showDescription(item.name);
			}

			// Increment position
			relativePos.x += relativePos.w + relativePos.paddingX;
			if (relativePos.x > pannelPos.x - 50)	{
				relativePos.x = windowPos.x + 50;
				relativePos.y += relativePos.h + relativePos.paddingY;
			}

		}

		// Right pannel
		const mainPannel = new Rectangle(pannelPos.x, pannelPos.y, pannelPos.w, pannelPos.h, {fill: "transparent", stroke: "black", lineWidth: 2});
		const panneIco = new Image(selectedItem.img, mainPannel.x + mainPannel.w / 2 - 75, mainPannel.y + 20, 150, 150, selectedItem.img);
		const itemName = new Text(selectedItem.name + " :", mainPannel.x + 20, panneIco.y + panneIco.h + 50, {size: 35, fill: "black", maxWidth: mainPannel.w - 30});
		
		const MAINDIV = document.getElementById("compressed_item_shop");
		MAINDIV.style.display = "block";

		const DESDIV = document.getElementById("compressed_item_shop_des");		
		DESDIV.innerHTML = selectedItem.description;
		MAINDIV.style.position = "absolute";
		MAINDIV.style.left = itemName.x;
		MAINDIV.style.top = itemName.y + 40;
		DESDIV.style.textAlign = "justify";
		MAINDIV.style.width = mainPannel.w - 30;
		MAINDIV.style.maxHeight = mainPannel.h - 20;

		document.getElementById("pannel_sell_button").onclick = function()	{
			sellItem(player, selectedItem);
		}

		document.getElementById("pannel_buy_button").onclick = function()	{
			buyItem(player, selectedItem);
		}

		// Display either buy or sell button
		if (selectedItem.ownedByPlayer)	{
			document.getElementById("pannel_buy_button").disabled = "disabled";
			document.getElementById("pannel_sell_button").disabled = "";
		} else	{
			document.getElementById("pannel_buy_button").disabled = "";
			document.getElementById("pannel_sell_button").disabled = "disabled";
		}

		// If not enough gold disable the buy button
		if (player.gold < selectedItem.cost)	{
			document.getElementById("pannel_buy_button").disabled = "disabled";
		}

		mainPannel.draw();
		panneIco.draw();
		itemName.draw();
		
		// Patch note button
		const PATCHNOTEBUTTON = new Text("View patch note", windowPos.x + 20, windowPos.y + windowPos.h - 15, {font: "Arial", size: 18, fill: "blue"});
		PATCHNOTEBUTTON.draw();
		if (PATCHNOTEBUTTON.clicked())	{
			patchNoteWindow.open();			// Opening patch notes window
			itemsMenuWindow.close();		// Closing item menu window
		}

		// Change the layout of the item shop
		const changeToUncompressed = new Image("Data/Images/uncompressed_item_shop.png", PATCHNOTEBUTTON.x + 150, PATCHNOTEBUTTON.y - 30, 40, 40, "uncompressed_item_shop");
		changeToUncompressed.draw();
		if (changeToUncompressed.clicked())	{
			settings.itemShopLayout = "uncompressed";
		}
	}


	