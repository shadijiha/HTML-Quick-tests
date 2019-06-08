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

		/**
		 * NOTE: To apply bonus damage from items, there are 2 types:
		 * ON-HIT effects		: These are applied here in the main animation FROM PLAYER
		 * REFLECTION effects	: These are applied here too FROM PLAYE
		 */

		// Applying reflection effects
		for (let i = 0; i < appyTo.ownedItems.length; i++)	{

			// Applying thormanail reflect damage
			if (appyTo.ownedItems[i].name == "Thornmail")	{
				applyFrom.damage(appyTo, appyTo.lastDamageTaken * 0.10, "true", "Thornmail");			// Reflecting 10% of the damage received as TRUE damage to the attacker
			}

		}

		// Applying On-Hit effects
		for (let i = 0; i < applyFrom.ownedItems.length; i++)	{

			// Applying Blade of the ruined King bonus damage damage
			if (applyFrom.ownedItems[i].name == "Blade of the ruined King")	{
				appyTo.damage(applyFrom, appyTo.hp * 0.08, "physical", "Blade of the ruined King");		// Applying 8% of targets current health as bonus physical damage
			}

		}

	}


	/* ALL ITMES */	

	function loadItmes()	{
	
		// sunfire_cape
		let sunfire_cape =	new Item(
								"Sunfire Cape",
								2900,
								"Data/Images/Sunfire_Cape_item.png",
								"UNIQUE PASSIVE: Grants 425 health and 50 armor"
							);	
		sunfire_cape.buff = function(obj)	{
			obj.hp += 425;
			obj.maxHp += 425;
			obj.bonusArmor += 50;
		};
		sunfire_cape.antiBuff = function(obj)	{
			obj.hp -= 425;
			obj.maxHp -= 425;
			obj.bonusArmor -= 50;
		};
		
		// Warmogs Armor
		let warmog =	new Item(
								"Warmogs Armor",
								2850,
								"Data/Images/Warmog's_Armor_item.png",
								`UNIQUE PASSIVE: Grants +200% <green> (+${((player.hpRegen * 3 - player.hpRegen) * 100).toFixed(2)}) </green> health regenration\n\nUNIQUE PASSIVE: Grants 800 health`
							);	
		warmog.buff = function(obj)	{
			obj.hpRegen *= 3;
			obj.hp += 800;
			obj.maxHp += 800;
		};
		warmog.antiBuff = function(obj)	{
			obj.hpRegen /= 3;
			obj.hp -= 800;
			obj.maxHp -= 800;
		};
		
		// Tear of the Goddess
		let tear =	new Item(
								"Tear of the Goddess",
								850,
								"Data/Images/Tear_of_the_Goddess_item.png",
								`UNIQUE PASSIVE: Grants +100% (+${(player.energyRegen * 200 - player.energyRegen).toFixed(2)}) energy regenration and reduces enegy costs by 20% <blue> (-${player.jumpCost * 0.20}) </blue> \n\n UNIQUE PASSIVE: Grants +20% <blue> (+${player.maxEnergy * 0.20}) </blue> bonus energy`
							);	
		tear.buff = function(obj)	{
			obj.energyRegen *= 2;
			obj.jumpCost *= 0.80;
			obj.maxEnergy *= 1.20;
		};
		tear.antiBuff = function(obj)	{
			obj.energyRegen /= 2;
			obj.jumpCost /= 0.80;
			obj.maxEnergy /= 1.20;
		};
		
		// Thornmail
		let thornmail =	new Item(
								"Thornmail",
								2900,
								"Data/Images/Thornmail_item.png",
								"UNIQUE PASSIVE: Grants +80 armor and +250 health \n \n UNIQUE PASSIVE: Reflect 10% of the damage received (after resitances) as TRUE damage to the attacker"
							);	
		thornmail.buff = function(obj)	{
			obj.hp += 250;
			obj.maxHp += 250;
			obj.bonusArmor += 80;
		};
		thornmail.antiBuff = function(obj)	{
			obj.hp -= 250;
			obj.maxHp -= 250;
			obj.bonusArmor -= 80;
		};
		
		// Infinity Edge
		let infinity_Edge =	new Item(
								"Infinity Edge",
								3400,
								"Data/Images/Infinity_Edge_item.png",
								`UNIQUE PASSIVE: Grants 80 attack damage and 25% critical strike chance\n\nUNIQUE PASSIVE: critical strikes deal 200% \n damage instead of <black> ${player.critMultiplier * 100}% </black>`
							);	
		infinity_Edge.buff = function(obj)	{
			obj.critChance += 0.25;
			obj.bonusAD += 80;
			obj.critMultiplier = 2;
		};
		infinity_Edge.antiBuff = function(obj)	{
			obj.critChance -= 0.25;
			obj.bonusAD -= 80;
			obj.critMultiplier = 1.5;
		};
		
		// Blood thirster
		let bloodThirster =	new Item(
								"The Bloodthirster",
								3500,
								"Data/Images/The_Bloodthirster_item.png",
								`UNIQUE PASSIVE: Grants +80 attack damage and 20% life steal \n UNIQUE PASSIVE: Grants a shield equals to 12% <green> (${floor(player.maxHp * 0.12)}) </green> of your maxium health if you fall below 30% <green> (${floor(player.maxHp * 0.30)}) </green> maximum health`
							);	

		bloodThirster.buff = function(obj)	{
			obj.bonusLifeSteal += 0.2;
			obj.bonusAD += 80;
		};
		bloodThirster.passive = function(obj)	{
			if (obj.hp < obj.maxHp * 0.30)	{
				obj.shieldHp = 0.12 * obj.maxHp;
				obj.shieldMaxHp = 0.12 * obj.maxHp;
				obj.shielded = true;
				
				obj.itemsPassiveApplied.push(bloodThirster);
			}		
		}
		bloodThirster.antiBuff = function(obj)	{
			obj.bonusLifeSteal -= 0.2;
			obj.bonusAD -= 80;
		};
		

		// Sterak's Gage
		let steraks =	new Item(
								"Sterak's Gage",
								3200,
								"Data/Images/Sterak's_Gage_item.png",
								`UNIQUE PASSIVE: Grants a shield equals to 50% <green> (${floor((player.maxHp - player.hp) * 0.50)}) </green> of your missing health if you fall below 10% <green> (${floor(player.maxHp * 0.10)}) </green> maximum health`
							);	
		steraks.buff = function(obj)	{	
		};
		steraks.passive = function(obj)	{
			if (obj.hp < obj.maxHp * 0.10)	{
				obj.shieldHp = 0.50 * (obj.maxHp - obj.hp);
				obj.shieldMaxHp = 0.50 * (obj.maxHp - obj.hp);
				obj.shielded = true;
				
				obj.itemsPassiveApplied.push(steraks);
			}		
		}
		steraks.antiBuff = function(obj)	{
		};
		
		// Lord Dominik's Regards
		let ldr =	new Item(
								"Lord Dominik's Regards",
								2800,
								"Data/Images/Lord_Dominik's_Regards_item.png",
								"UNIQUE PASSIVE: Grants +35% armor penetration"
							);	
		ldr.buff = function(obj)	{	
			obj.armorPen += 0.35;
		};
		ldr.antiBuff = function(obj)	{
			obj.armorPen -= 0.35;
		};
		
		// The unstoppable force
		let unstoppable =	new Item(
								"The unstoppable force",
								1800,
								"Data/Images/Unstoppable.jpg",
								`UNIQUE PASSIVE: Grants +90 armor and +450 health \n \n UNIQUE PASSIVE: Steals the armor and attack damage of the first enemy that enters your range  <red> (${player.range}) </red> units`
							);	
		unstoppable.buff = function(obj)	{	
			obj.bonusArmor += 90;
			obj.hp += 450;
			obj.maxHp += 450;
		};
		unstoppable.passive = function(obj)	{

			//let condition = false;

			for (let element of rangeFromEnemy)	{
				if (element.distance <= obj.range)	{
					obj.bonusArmor += element.object.armor;
					obj.bonusAD += element.object.ad;

					// Storing the armor and ad granted
					obj.itemsDataHolder.push({
						item: this.name,
						data1: element.object.armor,
						data2: element.object.ad
					});
					
					// Marking the passive as done
					obj.itemsPassiveApplied.push(unstoppable);
				}
			}
		}
		unstoppable.antiBuff = function(obj)	{
			obj.bonusArmor -= 90;
			obj.hp -= 450;
			obj.maxHp -= 450;

			// Removing the granted AD and armor from passive
			var tempArmor = 0;
			var tempAD = 0;
			for (let i = 0; i < obj.itemsDataHolder.length; i++)	{
				if (obj.itemsDataHolder[i].item == this.name)	{
					tempArmor = obj.itemsDataHolder[i].data1;
					tempAD = obj.itemsDataHolder[i].data2;
					obj.itemsDataHolder.splice(i, 1);
				}
			}
			obj.bonusArmor -= tempArmor;
			obj.bonusAD -= tempAD;

		};

		// Phantom dancer
		let phantom =	new Item(
								"Phantom dancer",
								2800,
								"Data/Images/Phantom_Dancer_item.png",
								"UNIQUE PASSIVE: Grants +30% critical strike chance and 45% attack speed"
							);	

		phantom.buff = function(obj)	{	
			obj.critChance += 0.3;
			obj.attackSpeed -= obj.attackSpeed * 0.45;
		};

		phantom.antiBuff = function(obj)	{
			obj.critChance -= 0.3;
			obj.attackSpeed += obj.attackSpeed * 0.45;
		};

		// Rapid fire canon
		let rapidFireCanon =	new Item(
								"Rapid fire canon",
								2800,
								"Data/Images/Rapid_Firecannon_item.png",
								`UNIQUE PASSIVE: Grants +50% <red> (+${player.range * 0.5}) </red> bonus range,  25% critical strike chance and 30% attack speed`
							);	

		rapidFireCanon.buff = function(obj)	{	
			obj.range *= 1.50;
			obj.critChance += 0.25;
			obj.attackSpeed -= obj.attackSpeed * 0.30;
		};

		rapidFireCanon.antiBuff = function(obj)	{
			obj.range /= 1.50;
			obj.critChance -= 0.25;
			obj.attackSpeed += obj.attackSpeed * 0.30;
		};

		// Mortal reminder
		let mortal_reminder =	new Item(
								"Mortal reminder",
								2800,
								"Data/Images/Mortal_Reminder_item.png",
								`UNIQUE PASSIVE: Grants +25 attack damage and +25% armor penetration \n \n UNIQUE PASSIVE: Converts 50% of your bonus armor to base armor`
							);	

		mortal_reminder.buff = function(obj)	{	
			obj.armorPen += 0.25;		// +25% armor penetration
			obj.bonusAD += 25;			// +25 attack damage

			// Converting the 50% bonus AD to base AD
			const TEMP		= obj.bonusArmor * 0.50;
			obj.bonusArmor	-= TEMP;
			obj.baseArmor	+= TEMP;

			obj.itemsDataHolder.push({
				item: this.name,
				data: TEMP
			});

		};

		mortal_reminder.antiBuff = function(obj)	{
			obj.armorPen -= 0.25;		// -25% armor penetration
			obj.bonusAD -= 25;			// -25 attack damage

			// Finding the amount of armor has been converted to base armor upone purchase
			var TEMP = 0;
			for (let i = 0; i < obj.itemsDataHolder.length; i++)	{
				if (obj.itemsDataHolder[i].item == this.name)	{
					TEMP = obj.itemsDataHolder[i].data;
					obj.itemsDataHolder.splice(i, 1);
				}
			}

			obj.bonusArmor	+= TEMP;
			obj.baseArmor	-= TEMP;
		};

		// Essence reaver
		let essence_Reaver =	new Item(
								"Essence reaver",
								3000,
								"Data/Images/Essence_Reaver_item.png",
								`UNIQUE PASSIVE: Grants +70 attack damage and +25 critical strike chance \n\n UNIQUE PASSIVE: Grants attack damage equals to your base armor <purple> (+${floor(player.baseArmor)}) </purple> if you fall below 50% (${floor(player.maxHp * 0.50)}) maximum health`
							);	

		essence_Reaver.buff = function(obj)	{	
			obj.bonusAD += 70;
			obj.critChance += 0.25;
		};

		essence_Reaver.passive = function(obj)	{

			if (obj.hp < obj.maxHp * 0.5)	{
				obj.bonusAD += obj.baseArmor;

				// Storing the granted amount
				obj.itemsDataHolder.push({
					item: this.name,
					data: obj.baseArmor
				});

				obj.itemsPassiveApplied.push(essence_Reaver);
			}		
		}

		essence_Reaver.antiBuff = function(obj)	{
			obj.bonusAD -= 70;
			obj.critChance -= 0.25;

			// Removing the granted AD amount
			var temp = 0;
			for (let i = 0; i < obj.itemsDataHolder.length; i++)	{
				if (obj.itemsDataHolder[i].item == this.name)	{
					temp = obj.itemsDataHolder[i].data;
					obj.itemsDataHolder.splice(i, 1);
				}
			}
			obj.bonusAD -= temp;

		};

		// Frozen heart
		let frozen_heart =	new Item(
								"Frozen heart",
								2700,
								"Data/Images/Frozen_Heart_item.png",
								`UNIQUE PASSIVE: Grants 8% <purple> (+${floor(player.maxHp * 0.08)}) </purple> of your maximum health as armor \n \n UNIQUE PASSIVE: Grants 100% of your bonus armor as bonus health <green> (+${floor(player.bonusArmor)}) </green>`
		);	

		frozen_heart.buff = function(obj)	{	
			obj.bonusArmor += obj.maxHp * 0.08;
			obj.maxHp += (obj.bonusArmor - obj.baseArmor);
			obj.hp += (obj.bonusArmor - obj.baseArmor);			
		};

		frozen_heart.antiBuff = function(obj)	{
			obj.bonusArmor -= obj.maxHp * 0.08;
			obj.maxHp -= (obj.bonusArmor - obj.baseArmor);
			obj.hp -= (obj.bonusArmor - obj.baseArmor);
		};

		
		// Iceborn Gauntlet
		let Iceborn_Gauntlet =	new Item(
								"Iceborn Gauntlet",
								2700,
								"Data/Images/Iceborn_Gauntlet_item.png",
								`UNIQUE PASSIVE: Grants +100 armor \n UNIQUE PASSIVE - <black> Giant strength </black> : Become immute to damage if you fall below 5% <green> (${floor(player.maxHp * 0.05)}) </green> maximum health for <black> ${3 + level} </black> seconds. During that time, your bonus AD is doubled and your critical strike chance is maximized. After the duration, your base armor is doubled`
		);	

		Iceborn_Gauntlet.buff = function(obj)	{	
			obj.bonusArmor += 65;
		};

		Iceborn_Gauntlet.passive = function(obj)	{

			if (obj.hp < obj.maxHp * 0.05)	{

				obj.immute = true;

				const CURRENTAD = obj.bonusAD;
				const CURRENTCRIT = obj.critChance;
				obj.bonusAD += CURRENTAD;
				obj.critChance = 1;

				setTimeout(function()	{
					obj.immute = false;

					// Removing the AD and the crit
					obj.bonusAD -= CURRENTAD;
					obj.critChance = CURRENTCRIT;

					// Adding the armor
					const TEMP = obj.baseArmor;
					obj.baseArmor *= 2;

					obj.itemsDataHolder.push({
						item: "Iceborn Gauntlet",
						data: TEMP
					});

				}, 3000 + (level * 1000) );
				
				obj.itemsPassiveApplied.push(Iceborn_Gauntlet);
			}		
		}

		Iceborn_Gauntlet.antiBuff = function(obj)	{
			obj.bonusArmor -= 65;

			// Removing the armor granted by passive
			var temp = 0;
			for (let i = 0; i < obj.itemsDataHolder.length; i++)	{
				if (obj.itemsDataHolder[i].item == this.name)	{
					temp = obj.itemsDataHolder[i].data;
					obj.itemsDataHolder.splice(i, 1);
				}
			}
			obj.baseArmor -= temp;

		};

		// Blade of the ruined King
		let bork =	new Item(
								"Blade of the ruined King",
								3200,
								"Data/Images/Blade_of_the_Ruined_King_item.png",
								`UNIQUE PASSIVE: Grants +40 attack damage and +12% life steal \n \n UNIQUE PASSIVE: damaging an enemy applies 8% of their current health as bonus physical damage`
							);	

		bork.buff = function(obj)	{	
			obj.bonusAD += 40;
			obj.bonusLifeSteal += 0.12;
		};

		bork.antiBuff = function(obj)	{
			obj.bonusAD -= 40;
			obj.bonusLifeSteal -= 0.12;
		};
	}

	loadItmes();
	
	
	