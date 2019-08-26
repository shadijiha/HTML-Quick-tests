 /***
 * 
 * MAIN Level_builder JavaScript file
 * 
 */

	const global = new Namespace("global");
 
	var dragged = false;	
	window.onmousedown = () =>	{
			dragged = true;
	}

	window.onmouseup = () =>	{
			dragged = false;
	}

	window.oncontextmenu = () =>	{
			lastClick.x = mouse.x;
			lastClick.y = mouse.y;
			deselectAll();
			closeGiveItemMenu();
			return false;
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
		}

	}

		
	var levelNumber = "3";
	var mode = "reposition";	
	var allObjects = [];
	var lastSelectedObject;
	var addItemsMenuOpened = false;

	
	// Setting up the player for the designer to know where the player will start
	worldElements = [player];
	player.draw = function()	{
		new Image(this.profile, this.x, this.y, this.w, this.h, this.profile).draw();
	}

	// This will serve to calculate how much have the scence moved to help reset it to the original point
	var referentiel = new Circle(0, 0, 15, {fill: "pink", stroke: "red"});
	worldElements.push(referentiel);
	
	function init()	{
		 
		var defaultX = 800;
		var defaultY = 500;
	
		var objectsNames = ["Player", "Decoration", "Platforme", "Decoration", "Decoration", "Loot", "Loot", "Loot", "Decoration"];
		var objSrc = ["monster.png", "cloud.png", "platforme.png", "tree1.png", "sun.png", "hp_potion.png", "gift.png", "goldx2.png", "tree2.png"];
		var args = [
					`(${defaultX}, ${defaultY})`,
					`('data/Images/cloud.png', ${defaultX}, ${defaultY}, 500, 150)`,
					`(${defaultX}, ${defaultY}, 200)`,
					`('data/Images/tree1.png', ${defaultX}, ${defaultY}, 150, 150)`,
					`('data/Images/sun.png', ${defaultX}, ${defaultY}, 150, 150)`,
					`("Data/Images/hp_potion.png", ${defaultX}, ${defaultY}, '')`,
					`("Data/Images/gift.png", ${defaultX}, ${defaultY}, '')`,
					`("Data/Images/goldx2.png", ${defaultX}, ${defaultY}, '')`,
					`('data/Images/tree2.png', ${defaultX}, ${defaultY}, 150, 150)`
					];
		
		const DIV = document.getElementById("objectsNames");
		
		for (let i = 0; i < objectsNames.length; i++)
		{			
			DIV.innerHTML += `<img src="data/Images/${objSrc[i]}" class="objectImage" width="40%" height="40%" />`;			
		}
		
		// Adding onclick event
		var dom = document.getElementsByClassName("objectImage");
		for (let i = 0; i < dom.length; i++)
		{
			dom[i].addEventListener("click", function()	{
				addObject(`${objectsNames[i]}`, `${args[i]}`);
			});			
		}		
	}
	init();
 
	function render()	{
	
		ground.draw();
		c.globalAlpha = 0.5;
		player.draw();
		c.globalAlpha = 1;
		
		for (let temp of allObjects)	{
			temp.draw();
			
			// Changing objects position by hovering and dragging mouse
			if (dragged && temp.hover() && mode == "reposition" && !temp.locked)	{
				temp.x = mouse.x - temp.w / 2;
				temp.y = mouse.y - temp.h / 2;
			}
			
			// Selecting objects onClick
			if (temp.clicked())	{
			
				// Change mode
				changeMode("reposition");
			
				// Deselecting all other objects
				deselectAll();
				
				// selecting clicked object
				temp.selected = true;
			}
			
			// Drawing a border if object is selected
			if (temp.selected)	{
			
				lastSelectedObject = temp;
			
				// Updating properties
				if (mode == "manual" && !temp.locked)	{
					temp.x = Number(document.getElementById("objX").value);
					temp.y = Number(document.getElementById("objY").value);
					temp.w = Number(document.getElementById("objW").value);
					temp.h = Number(document.getElementById("objH").value);
					
					// for class Image update tempRect dimensions
					if (temp.updateDimensions)	{
						temp.updateDimensions(temp.w, temp.h);
					}
					
				} else	{
					document.getElementById("objX").value = temp.x;
					document.getElementById("objY").value = temp.y;
					document.getElementById("objW").value = temp.w;
					document.getElementById("objH").value = temp.h;			
				}

				// drawing the selected border
				new Rectangle(temp.x, temp.y, temp.w, temp.h, {fill: "transparent", stroke: "blue", lineWidth: 2}).draw();
				
				// Drawing the delete button
				if (!temp.locked)	{
					var deleteImage = new Image("data/Images/x.png", temp.x + temp.w + 25, temp.y - 12, 25, 25, "deleteImage");
					deleteImage.draw();
					if (deleteImage.clicked())	{
						deleteObject(temp);
					}
				}
				
				// Drawing the locking button
				var lockImage;
				if (temp.locked)	{
					lockImage = new Image("data/Images/locked.png", temp.x + temp.w + 25, temp.y + 20, 25, 25, "lockImage");
				} else	{
					lockImage = new Image("data/Images/unlocked.png", temp.x + temp.w + 25, temp.y + 20, 25, 25, "unlockImage");
				}				
				lockImage.draw();
				
				if (lockImage.clicked())	{
					if (!temp.locked)	{
						temp.locked = true;
						lastClick = {x: 0, y: 0};
					} else	{
						temp.locked = false;
						lastClick = {x: 0, y: 0};
					}					
				}
				

				// drawing the resize corners
				var corners = [
					new Rectangle(temp.x - 15, temp.y - 15),
					new Rectangle(temp.x - 15, temp.y + temp.h / 2),
					new Rectangle(temp.x - 15, temp.y + temp.h),
					new Rectangle(temp.x + temp.w, temp.y - 15),
					new Rectangle(temp.x + temp.w, temp.y + temp.h / 2),
					new Rectangle(temp.x + temp.w, temp.y + temp.h)
				];
				
				for (let corner of corners)	{
					corner.w = 15;
					corner.h = 15;
					corner.fill = "white";
					corner.stroke = "blue";
					corner.lineWidth = 2;
					corner.draw();
					
					
					if (dragged && corner.hover() && mode == "resize" && !temp.locked)	{
						
						var xDiff = mouse.x - (temp.x + temp.w);
						var yDiff = mouse.y - (temp.y + temp.h)
						
						temp.w = temp.w + xDiff;
						temp.h = temp.h + yDiff;						
						
						// for class Image update tempRect dimensions
						if (temp.updateDimensions)	{
							temp.updateDimensions(temp.w, temp.h);
						}
												
					} else	{
						global.mouseStartPos = {x: mouse.x, y: mouse.y}
					}

				}
				

				// If the object is player, drawing the items slots
				if (temp.constructor.name == "Player")	{
					
					// Drawing six item slots
					var offset = {x: temp.x - 70, y: temp.y - 15, initialX: temp.x - 70, w: 15, h: 15};
					
					// Drawing owned Items
					for (let item of temp.ownedItems)	{
						
						var itemSplot = new Image(item.img, offset.x, offset.y, offset.w, offset.h, `object${allObjects.indexOf(temp)}_${item.name}_item`).draw();

						if (itemSplot != undefined && itemSplot.clicked())	{
							addItemsMenuOpened = true;
						}

						offset.x += (offset.w + 2);
						if (offset.x >= offset.initialX + (3 * (offset.w + 2) )) {
							offset.x = offset.initialX;
							offset.y += (offset.h + 2);
						}						
					}
					
					// Drawing the remaining of the unsed slots
					for(let i = 0; i < 6 - temp.ownedItems.length; i++)	{
						
						var itemSplot = new Rectangle(offset.x, offset.y, offset.w, offset.h, {fill: "lightgrey", stroke: "black", lineWidth: 1});
						itemSplot.draw();
						
						if (itemSplot != undefined && itemSplot.clicked())	{
							addItemsMenuOpened = true;
						}
						
						offset.x += (offset.w + 2);
						if (offset.x >= offset.initialX + (3 * (offset.w + 2))) {
							offset.x = offset.initialX;
							offset.y += (offset.h + 2);
						}

					}					
				
					// Showing the add items to monster menu
					if (addItemsMenuOpened)	{
						openGiveItemMenu(temp);
					} else	{
						closeGiveItemMenu();
					}
				
				} else if (temp.constructor.name == "Loot")	{
					
					const INPUT = document.getElementById("buff_input");
					INPUT.style.display = "block";
					INPUT.style.position = "absolute";
					INPUT.style.top = (temp.y - 100) + "px";
					INPUT.style.left = (temp.x - 150) + "px";

					if (document.activeElement != INPUT)	{
						INPUT.value = temp.buff;
					}

					INPUT.onkeyup = function()	{
						temp.buff = INPUT.value;
					}

					INPUT.onchange = function()	{
						temp.buff = INPUT.value;
					}

				}
			}			
		}
	
		// Updating code
		if (document.getElementById("showCode").checked)	{
			document.getElementById("code").value = generateCode();
			document.getElementById("code").style.display = "block";
		} else	{
			document.getElementById("code").style.display = "none";
		}

		if (document.getElementById("showMapCode").checked)	{
			document.getElementById("mapCode").value = generateJSONToText();
			document.getElementById("mapCode").style.display = "block";
		} else	{
			document.getElementById("mapCode").style.display = "none";
		}
		
	}
	
	function openGiveItemMenu(obj)	{
		
		obj.gold = 123456;
		
		const DIV = document.getElementById("menu");
		DIV.style.display = "block";
		DIV.style.top = obj.y - 270;
		DIV.style.left = obj.x - 250;
		
		for (let item of allItmes)	{

			if (document.getElementById(item.name) == undefined)	{		
				var dom = `<img src="${item.img}" id="${item.name}" style="width: 50px; height: 50px;" OnClick="buyItem(allObjects[${allObjects.indexOf(obj)}], allItmes[${allItmes.indexOf(item)}]);" /> \n`;

				DIV.innerHTML += dom;

			} else	{
				document.getElementById(item.name).onclick = function()	{
					buyItem(allObjects[allObjects.indexOf(obj)], allItmes[allItmes.indexOf(item)]);
				}
			}

		
		}
		
	}

	function closeGiveItemMenu()	{
		document.getElementById("menu").style.display = "none";
		document.getElementById("buff_input").style.display = "none";
	}
	
	function addObject(type, ar)	{
		
		var temp = eval(`new ${type}${ar}`);
		
		// If the player if type monster setting the draw() function and changing the profile
		if (type == "Player")	{
			temp.profile = "data/Images/monster.png";
			temp.draw = function()	{
				new Image(this.profile, this.x, this.y, this.w, this.h, this.profile).draw();
			}
		}
		
		allObjects.push(temp);

		// Pushing object to worldElements if it doesn't exist
		var exists = false;
		for (let ele of worldElements)	{
			if (temp == ele)	{
				exists = true;
				break;
			}
		}

		if (!exists)	{
			worldElements.push(temp);
		}
		
		// Change mode to reposition with mouse
		changeMode("reposition");

	}
 
	function changeMode(val)	{
		mode = val;
		document.getElementById(val).checked = "checked";
	}

	function deleteObject(obj)	{
	
		var objectToDelete = obj;
		
		if (objectToDelete == undefined)	{
			objectToDelete = lastSelectedObject;
		}	
	
		if (!objectToDelete.locked)	{
			allObjects.splice(allObjects.indexOf(objectToDelete), 1);
			worldElements.splice(worldElements.indexOf(objectToDelete), 1);
		}
		
	}

	function deselectAll()	{
		for (let otherObject of allObjects)	{
			otherObject.selected = false;
		}

		addItemsMenuOpened = false;	// Close all opened add items menus
				
	}
 
