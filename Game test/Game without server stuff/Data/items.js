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

		// Record replay
		if (obj.name == player.name)	{
			replay.push({
				action: `buyItem(player, allItmes[${allItmes.indexOf(item)}])`,
				timeStamp: time
			});
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

		// Record replay
		if (obj.name == player.name)	{
			replay.push({
				action: `sellItem(player, allItmes[${allItmes.indexOf(item)}])`,
				timeStamp: time
			});
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

				// Applying thormanail reflect damage
				if (appyTo.ownedItems[i].name == "Thornmail")	{
					applyFrom.damage(appyTo, {value: appyTo.lastDamageTaken * 0.10, type: "true", description: "Thornmail"});			// Reflecting 10% of the damage received as TRUE damage to the attacker
				}

			}

			// Applying On-Hit effects
			for (let i = 0; i < applyFrom.ownedItems.length; i++)	{

				// Applying Blade of the ruined King bonus damage
				if (applyFrom.ownedItems[i].name == "Blade of the ruined King")	{
					appyTo.damage(applyFrom, {value: appyTo.hp * 0.08, type: "physical", description: "Blade of the ruined King"});		// Applying 8% of targets current health as bonus physical damage
				}

				// Applying Statikk Shiv bonus damage
				if (applyFrom.ownedItems[i].name == "Statikk Shiv")	{
					appyTo.damage(applyFrom, {value: (appyTo.maxHp - appyTo.hp) * 0.10, description: "Statikk Shiv", allowCrit: false});
				}

				// Applying Runaan's Hurricane passive
				if (applyFrom.ownedItems[i].name == "Runaan's Hurricane")	{
					if (!applyFrom.hurricaneApplied)	{

						const CD = 5 * (applyFrom.attackSpeed * 1.66);

						applyFrom.shoot(applyFrom.shootImage, applyFrom.y - applyFrom.h / 2);
						applyFrom.shoot(applyFrom.shootImage, applyFrom.y);
						applyFrom.shoot(applyFrom.shootImage, applyFrom.y + applyFrom.h / 2);

						setTimeout(function()	{
							applyFrom.hurricaneApplied = false;
						}, CD * 1000);

						new Ability(2786, CD, "Data/Images/Runaan_s_Hurricane_item.png", applyFrom, `${applyFrom.ownedItems[i].name} is cooling down<br /><br />Source: ${applyFrom.name}`);	// Cooldown

						applyFrom.hurricaneApplied = true;
					}
				}

				// Applying Duskblade of Draktharr NIGHTMARE passive
				if (applyFrom.ownedItems[i].name == "Duskblade of Draktharr")	{
					if (!applyFrom.duskbladeApplied)	{

						const CD = 7 * applyFrom.attackSpeed;

						appyTo.damage(applyFrom, {value: 10 + (applyFrom.ad * 0.60), type: "physical", description: "Duskblade of Draktharr", allowCrit: true});

						setTimeout(function()	{
							applyFrom.duskbladeApplied = false;
						}, CD * 1000);

						// Cooldown
						new Ability(3976, CD, applyFrom.ownedItems[i].img, applyFrom, `${applyFrom.ownedItems[i].name} is cooling down <br /> <br />Source: ${applyFrom.name}`);

						applyFrom.duskbladeApplied = true;
					}
				}
			}

		}, 1000);

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
	
			holder.antiBuff = temp.antibuff;

		}
		
	}

	loadItmes(player);
	
	
	