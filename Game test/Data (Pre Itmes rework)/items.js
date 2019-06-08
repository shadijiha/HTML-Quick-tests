/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file works on items
 * 
 *
 */


 	/**************************************
	**************** Items ****************
	**************************************/
	//let ownedItems = [];
	
	function buyItem(obj, item)	{
		let tempOwnedItem = false;
		
		// Descovering if the item is already in the object inventory
		for (let i = 0; i < obj.ownedItems.length; i++)	{
			if (obj.ownedItems[i].name == item.name)	{
				tempOwnedItem = true;
			}
		}
		
		if (obj.gold > item.cost && obj.itemOwnedCount <= 6 && !tempOwnedItem)	{
			obj.gold -= item.cost;
			obj.ownedItems.push(item);
			obj.itemOwnedCount += 1;
		}
		
		//drawItemSlot();
	}
	
	function sellItem(obj, item)	{
		let tempOwnedItem = false;
		
		// Descovering if the item is already in the object inventory
		for (let i = 0; i < obj.ownedItems.length; i++)	{
			if (obj.ownedItems[i].name == item.name)	{
				tempOwnedItem = true;
			}
		}		

		if (tempOwnedItem)	{
			obj.gold += item.sell;
			obj.ownedItems.splice(item, 1);
			obj.itemOwnedCount -= 1;
			item.buffApplied = false;
			item.removeBuff(obj);
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
	

	/* ALL ITMES */	
	let allItmes = [];
	
	
	// sunfire_cape
	let sunfire_cape =	new Item(
							"Sunfire Cape",
							2900,
							"Data/Images/Sunfire_Cape_item.png",
							"PASSIVE: UNIQUE: Grants 425 health and\n50 armor"
						);	
	sunfire_cape.buff = function(obj)	{
		obj.hp += 425;
		obj.maxHp += 425;
		obj.armor += 50;
	};
	sunfire_cape.antiBuff = function(obj)	{
		obj.hp -= 425;
		obj.maxHp -= 425;
		obj.armor -= 50;
	};
	
	// Warmogs Armor
	let warmog =	new Item(
							"Warmogs Armor",
							2850,
							"Data/Images/Warmog's_Armor_item.png",
							"PASSIVE: UNIQUE: Grants +200% health\nregenration \n\nPASSIVE: UNIQUE: Grants 800 health"
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
							"PASSIVE: UNIQUE: Grants +100% energy\nregenration and reduces enegy costs by 20% \n\nPASSIVE: UNIQUE: Grants +20% bonus energy"
						);	
	tear.buff = function(obj)	{
		obj.energyRegen *= 4;
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
							"PASSIVE: UNIQUE: Grants +80 armor\nand +250 health"
						);	
	thornmail.buff = function(obj)	{
		obj.hp += 250;
		obj.maxHp += 250;
		obj.armor += 80;
	};
	thornmail.antiBuff = function(obj)	{
		obj.hp -= 250;
		obj.maxHp -= 250;
		obj.armor -= 80;
	};
	
	// Infinity Edge
	let infinity_Edge =	new Item(
							"Infinity Edge",
							3400,
							"Data/Images/Infinity_Edge_item.png",
							"PASSIVE: UNIQUE: Grants 70 attack damage\nand 20% critical strike chance"
						);	
	infinity_Edge.buff = function(obj)	{
		obj.critChance += 0.20;
		obj.ad += 70;
	};
	infinity_Edge.antiBuff = function(obj)	{
		obj.critChance -= 0.20;
		obj.ad -= 70;
	};
	
	// Blood thirster
	let boodThirster =	new Item(
							"The Bloodthirster",
							3500,
							"Data/Images/The_Bloodthirster_item.png",
							"PASSIVE: UNIQUE: Grants +80 attack damage\n\nPASSIVE: UNIQUE: Grants a shield equals to\n12% of your maxium health if you fall below\n30% maximum health"
						);	
	boodThirster.buff = function(obj)	{
		obj.lifeSteal += 0;
		obj.ad += 80;
	};
	boodThirster.evalBuff = function(obj)	{
		if (obj.hp < obj.maxHp * 0.30)	{
			obj.shieldHp = 0.12 * obj.maxHp;
			obj.shieldMaxHp = 0.12 * obj.maxHp;
			obj.shielded = true;
			
			boodThirster.conditionAquired = true;
		}		
	}
	boodThirster.antiBuff = function(obj)	{
		obj.lifeSteal -= 0;
		obj.ad -= 80;
	};
	

	// Sterak's Gage
	let steraks =	new Item(
							"Sterak's Gage",
							3200,
							"Data/Images/Sterak's_Gage_item.png",
							"PASSIVE: UNIQUE: Grants a shield equals to\n50% of your missing health if you fall below\n10% maximum health"
						);	
	steraks.buff = function(obj)	{	
	};
	steraks.evalBuff = function(obj)	{
		if (obj.hp < obj.maxHp * 0.10)	{
			obj.shieldHp = 0.50 * (obj.maxHp - obj.hp);
			obj.shieldMaxHp = 0.50 * (obj.maxHp - obj.hp);
			obj.shielded = true;
			
			steraks.conditionAquired = true;
		}		
	}
	steraks.antiBuff = function(obj)	{
	};
	
	// Lord Dominik's Regards
	let ldr =	new Item(
							"Lord Dominik's Regards",
							2800,
							"Data/Images/Lord_Dominik's_Regards_item.png",
							"PASSIVE: UNIQUE: Grants +35% armor\npenetration"
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
							"PASSIVE: UNIQUE: Grants +50 armor and 500\nhealth\nPASSIVE: UNIQUE: quadrubles your armor and\nyour health regenration and grants a shield equals to\n10% of your maximum health if an enemy if less than\n500 units away for 20 seconds"
						);	
	unstoppable.buff = function(obj)	{	
		obj.armor += 50;
		obj.hp += 500;
		obj.maxHp += 500;
	};
	unstoppable.evalBuff = function(obj)	{
		if (rangeFromEnemy <= 500)	{
			obj.shieldHp = 0.10 * obj.maxHp;
			obj.shieldMaxHp = 0.10 * obj.maxHp;
			obj.shielded = true;
			
			obj.armor *= 4;
			obj.hpRegen *= 4;
			
			setTimeout(function()	{
				obj.shielded = false;
				obj.armor /= 4;
				obj.hpRegen /= 4;
			}, 20000);
			
			unstoppable.conditionAquired = true;
		}
	}
	unstoppable.antiBuff = function(obj)	{
		obj.armor -= 50;
		obj.hp -= 500;
		obj.maxHp -= 500;
	};
	


	// Pushing all itmes to the global array
	allItmes = [...allItmes, sunfire_cape, warmog, tear, thornmail, infinity_Edge, boodThirster, steraks, ldr, unstoppable];
	
	
	
	
	