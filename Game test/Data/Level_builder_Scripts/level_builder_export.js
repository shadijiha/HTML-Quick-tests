/***
 * 
 * Level_builder JavaScript file to EXPORT already done levels
 * 
 */

	function generateCode()	{
	
		levelNumber = document.getElementById("levelNumber").value;
		var monstersCount = 0;
		
		var str = `
/*** 
* 
* JavaScript file for "Game test" project 
* 
* This JavaScript file builds LEVEL ${levelNumber}
* 
*
*/
					 
	function loadLevel${levelNumber}()	{
		
		worldElements = [ground, castle];
		monsters = [];
		loots = [];
		platformes = [];
		decorations = [];\n \n`;
		
		for (let temp of allObjects)	{
		
			switch(temp.constructor.name)	{
			
				case "Player":

					// Default settings for each monster
					str += `		var monster${monstersCount} = new Player(${temp.x}, ${temp.y});\n 		monster${monstersCount}.shootImage = "bullet";\n		monster${monstersCount}.attackSpeed = 0.33;\n 		monster${monstersCount}.profile = "Data/Images/monster.png";\n 		monster${monstersCount}.bulletSpeed = -3;\n		monster${monstersCount}.name = 'Monster ${monstersCount}';\n		monsters.push(monster${monstersCount});\n`;
					
					// Adding command to buy items for specific monster on level load
					for (let ownedItem of temp.ownedItems)	{
						str += `		monster${monstersCount}.gold += ${ownedItem.cost}; \n		buyItem(monster${monstersCount}, allItmes[${allItmes.indexOf(ownedItem)}]); \n`;
					}
					str += '\n';

					monstersCount++;
					break;
				case "Platforme":
					str += `		new Platforme(${temp.x}, ${temp.y}, ${temp.w}); \n`;
					break;
				case "Decoration":
					str += `		new Decoration('${temp.src}', ${temp.x}, ${temp.y}, ${temp.w}, ${temp.h}); \n`;
					break;
				case "Loot":
					str += `		new Loot('${temp.src}', ${temp.x}, ${temp.y}, ${temp.w}, ${temp.h}).buff = function()	{\n		${temp.buff}\n		}; \n`;
					break;		
			}

		}
		
		str += `
		for (let myMonster of monsters)	{			
			applyBuffsToAllItems(myMonster);
			
			for (let i = 0; i < level; i++)	{
				myMonster.levelUp();
			}
			
			worldElements.push(myMonster);
		}
	}`;
		
		return str;		
	}

	function resetworldPos()	{
		// Moving world back to beginning
		var amountMoved = referentiel.x;
		moveWorld(-amountMoved);		
	}

	function exportFile()	{
		
		// Moving world back to beginning
		resetworldPos()

		var txt = generateCode();
		
		// Exporting file
		var textFileAsBlob = new Blob([ txt ], { type: 'text/plain' });
		var fileNameToSaveAs = `level${levelNumber}.js`;

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null) {
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		  } else {
			// Firefox requires the link to be added to the DOM before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		  }

		 downloadLink.click();
	}
	
	function destroyClickedElement(event) {
		// remove the link from the DOM
		document.body.removeChild(event.target);
	}

	function generateJSON()	{

		var json = {data: []};

		for (let temp of allObjects)	{
		
			var holder = json.data[allObjects.indexOf(temp)];
			
			var jsonExport;

			if (temp.constructor.name == "Player")	{
				jsonExport = {
					type: temp.constructor.name,
					posX: temp.x,
					posY: temp.y,
					width: temp.w,
					height: temp.h,
					source: temp.profile,
					items: []
				};

				// Register the index of all monster items
				for (let item of temp.ownedItems)	{
					jsonExport.items.push(allItmes.indexOf(item));
				}

			} else	if (temp.constructor.name == "Loot")	{
				jsonExport = {
					type: temp.constructor.name,
					posX: temp.x,
					posY: temp.y,
					width: temp.w,
					height: temp.h,
					source: temp.src,
					buff: temp.buff
				};				
			} else {
				jsonExport = {
					type: temp.constructor.name,
					posX: temp.x,
					posY: temp.y,
					width: temp.w,
					height: temp.h,
					source: temp.src
				};
			}

			json.data.push(jsonExport);
		}

		return json;

	}

	function generateJSONToText()	{

		var code = generateJSON();

		return JSON.stringify(code);

	}

	function exportJSONMap()	{
		
	}