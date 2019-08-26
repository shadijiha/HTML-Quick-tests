/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on items
 * 
 *
 */


	/*************************************
	**************** Items ***************
	*********************************** */
	
	function buyItem(obj, item)	{
		let tempOwnedItem = false;
		
		// Descovering if the item is already in the object inventory
		for (let i = 0; i < obj.ownedItems.length; i++)	{
			if (obj.ownedItems[i].name == item.name)	{
				tempOwnedItem = true;
			}
		}
		
		// Buying the item
		if (obj.gold > item.cost && obj.ownedItems.length < 6 && !tempOwnedItem && obj.hp > 0)	{
			obj.gold -= item.cost;
			obj.ownedItems.push(item);

			// Checking if the buyer is the player (this will help to display Sell/Buy buttons in the item shop)
			if (obj.profile == "Data/Images/player.png")	{
				item.ownedByPlayer = true;
			}

		}

	}
	
	function sellItem(obj, item)	{
		let tempOwnedItem = false;
		let index = 0;
		let activeIndex = 0;
		let passiveIndex = 0;
		
		// Descovering if the item is already in the object inventory
		for (let i = 0; i < obj.ownedItems.length; i++)	{
			if (obj.ownedItems[i].name == item.name)	{
				tempOwnedItem = true;
				index = i;
			}
		}

		// Descovering if the index of the item in the itemsActiveApplied array
		for (let i = 0; i < obj.itemsActiveApplied.length; i++)	{
			if (obj.itemsActiveApplied[i].name == item.name)	{
				activeIndex = i;
			}
		}

		// Descovering if the index of the item in the itemsPassiveApplied array
		for (let i = 0; i < obj.itemsPassiveApplied.length; i++)	{
			if (obj.itemsPassiveApplied[i].name == item.name)	{
				passiveIndex = i;
			}
		}

		// Selling the item
		if (tempOwnedItem && obj.hp > 0)	{
			obj.gold += item.sell;
			obj.ownedItems.splice(index, 1);
			obj.itemOwnedCount -= 1;
			obj.itemsActiveApplied.splice(activeIndex, 1);
			obj.itemsPassiveApplied.splice(passiveIndex, 1);
			item.removeBuff(obj);
			
			// Checking if the seller is the player (this will help to display Sell/Buy buttons in the item shop)
			if (obj.profile == "Data/Images/player.png")	{
				item.ownedByPlayer = false;
			}

		}
	}
	
	function applyBuffsToAllItems(myobj)	{
		for (let i = 0; i < myobj.ownedItems.length; i++)	{
			myobj.ownedItems[i].applyBuff(myobj);
			
			if (myobj.ownedItems[i].continousBuff != undefined)	{
				myobj.ownedItems[i].continousBuff(myobj);
			}
		}
	}

	function applyItemsEffects(applyFrom, appyTo)	{

		setTimeout(function()	{

			/**
			 * NOTE: To apply bonus damage from items, there are 2 types:
			 * ON-HIT effects		: These are applied here in the main animation FROM PLAYER
			 * REFLECTION effects	: These are applied here FROM PLAYER
			 */

			// Applying reflection effects
			for (let i = 0; i < appyTo.ownedItems.length; i++)	{

				if (appyTo.ownedItems[i].reflectEffect != undefined)	{
					appyTo.ownedItems[i].reflectEffect(appyTo, applyFrom);
				}				

			}

			// Applying On-Hit effects
			for (let i = 0; i < applyFrom.ownedItems.length; i++)	{

				if (applyFrom.ownedItems[i].onhit != undefined)	{
					applyFrom.ownedItems[i].onhit(applyFrom, appyTo);
				}

			}

		}, 100);

	}


	/* ALL ITMES */	

	function loadItmes(object)	{

		var temp_load_items = getItemsList(object);
	
		for (var temp of temp_load_items)	{

			var holder = new Item(
				temp.name,
				temp.cost,
				temp.icon,
				temp.description
			);

			holder.buff = temp.buff;
	
			if (temp.passive != undefined)	{
				holder.passive = temp.passive;
			}

			if (temp.onhit != undefined)	{
				holder.onhit = temp.onhit;
			}
			
			if (temp.reflectEffect != undefined)	{
				holder.reflectEffect = temp.reflectEffect;
			}
	
			holder.antiBuff = temp.antibuff;

		}
		
	}

	loadItmes(player);
	
	
	