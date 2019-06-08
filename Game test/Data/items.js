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
			 * REFLECTION effects	: These are applied here too FROM PLAYE
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

		}, 100);

	}


	/* ALL ITMES */	

	function loadItmes(object)	{
	
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
								`UNIQUE PASSIVE: Grants +200% <green> (+${((object.hpRegen * 3 - object.hpRegen) * 100).toFixed(2)}) </green> health regenration<br /><br />UNIQUE PASSIVE: Grants 800 health`
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
								`UNIQUE PASSIVE: Grants +100% <blue>(+${(object.energyRegen * 100).toFixed(2)})</blue> energy regenration and reduces enegy costs by 20% <blue>(-${object.jumpCost * 0.20})</blue> <br /><br /> UNIQUE PASSIVE: Grants +20% <blue>(+${object.maxEnergy * 0.20})</blue> bonus energy`
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
								"UNIQUE PASSIVE: Grants +80 armor and +250 health <br /> <br /> UNIQUE PASSIVE: Reflect 10% of the damage received (after resitances) as TRUE damage to the attacker"
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
								`UNIQUE PASSIVE: Grants 80 attack damage and 20% critical strike chance<br /><br />UNIQUE PASSIVE: critical strikes deal 200% <br /> damage instead of <b> 150% </b>`
							);	
		infinity_Edge.buff = function(obj)	{
			obj.critChance += 0.20;
			obj.bonusAD += 80;
			obj.critMultiplier = 2;
		};
		infinity_Edge.antiBuff = function(obj)	{
			obj.critChance -= 0.20;
			obj.bonusAD -= 80;
			obj.critMultiplier = 1.5;
		};
		
		// Blood thirster
		let bloodThirster =	new Item(
								"The Bloodthirster",
								3500,
								"Data/Images/The_Bloodthirster_item.png",
								`UNIQUE PASSIVE: Grants +80 attack damage and 20% life steal <br /> UNIQUE PASSIVE: Grants a shield equals to 12% <green> (${floor(object.maxHp * 0.12)}) </green> of your maxium health if you fall below 30% <green> (${floor(object.maxHp * 0.30)}) </green> maximum health (20 seconds cooldown)`
							);	

		bloodThirster.buff = function(obj)	{
			obj.bonusLifeSteal += 0.2;
			obj.bonusAD += 80;
		};
		bloodThirster.passive = function(obj)	{
			if (obj.hp < obj.maxHp * 0.30)	{

				obj.shieldHp += 0.12 * obj.maxHp;
				obj.shieldMaxHp += 0.12 * obj.maxHp;
				obj.shielded = true;
				obj.bloodThirsterCD = 20;

				// Cooldown to display
				/*if (!obj.bloodThirsterRemainingCD)	{
					obj.bloodThirsterRemainingCD = obj.bloodThirsterCD;
				}
				
				const TEMPINT = setInterval(function()	{
					if (obj.bloodThirsterRemainingCD > 0)	{
						obj.bloodThirsterRemainingCD -= 1;
					} else	{
						clearInterval(TEMPINT);
					}
				}, 1000);*/

				// After 20 second delay removing this item from the item buff applied
				setTimeout(function()	{
					for (let element of obj.itemsPassiveApplied)	{
						if (element.name == "The Bloodthirster")	{
							obj.itemsPassiveApplied.splice(obj.itemsPassiveApplied.indexOf(element), 1);
						}
					}
				}, obj.bloodThirsterCD * 1000);
				
				new Ability(3545, 20, this.img, obj, "The Bloodthirster is on cooldown and connot be triggered");
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
								"Data/Images/Sterak_s_Gage_item.png",
								`UNIQUE PASSIVE: Grants a shield equals to 50% <green> (${floor((object.maxHp - object.hp) * 0.50)}) </green> of your missing health if you fall below 10% <green> (${floor(object.maxHp * 0.10)}) </green> maximum health (25 seconds cooldown)`
							);	
		steraks.buff = function(obj)	{	
		};
		steraks.passive = function(obj)	{
			if (obj.hp < obj.maxHp * 0.10)	{
				obj.shieldHp += 0.50 * (obj.maxHp - obj.hp);
				obj.shieldMaxHp += 0.50 * (obj.maxHp - obj.hp);
				obj.shielded = true;

				// After 25 second delay removing this item from the item buff applied
				setTimeout(function()	{
					for (let element of obj.itemsPassiveApplied)	{
						if (element.name == "Sterak's Gage")	{
							obj.itemsPassiveApplied.splice(obj.itemsPassiveApplied.indexOf(element), 1);
						}
					}
				}, 25000);
				
				new Ability(7679, 25, this.img, obj, "Sterak's Gage is on cooldown and connot be triggered");
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
								2600,
								"Data/Images/Unstoppable.jpg",
								`UNIQUE PASSIVE: Grants +30 armor and +350 health <br /> <br /> 
								 UNIQUE PASSIVE: Steals 50% of the armor of all enemies in your range <red>(${object.range})</red>`
							);	
		unstoppable.buff = function(obj)	{	
			obj.bonusArmor += 30;
			obj.hp += 350;
			obj.maxHp += 350;
			
			obj.unstoppableTotalArmorStolen = 0;

		};
		unstoppable.passive = function(obj)	{


			// looping throw the distance from OBJ to see if any enemy is in range
			for (let data of obj.distanceFromObjects)	{

				if (data.distance <= obj.range)	{

					// Appying the ARMOR STEAl
					if (!data.object.unstoppableApplied)	{
						data.object.unstoppableArmorStolen = data.object.armor * 0.50;
						obj.bonusArmor += data.object.unstoppableArmorStolen;
						data.object.bonusArmor -= data.object.unstoppableArmorStolen;

						obj.unstoppableTotalArmorStolen += data.object.unstoppableArmorStolen;	// For stats
					}

					// Showing the image indicator above the affected object
					//new Image("https://i.imgur.com/S9QSWAj.jpg", data.object.x + 25, data.object.y - 75, 35, 35, "trihard").draw();

					/* Showing the Debuff on data.object HUD and storing it to delete it after */
					data.object.tempBuffUnstoppable = new Buff(6976, `-${floor(data.object.unstoppableArmorStolen)}`, this.img, data.object, `This unit armor is reduced by 50% <purple>(-${floor(data.object.unstoppableArmorStolen)})</purple> <br /><br /> Source: ${obj.name}`);

					// Storing a temp variable to not apply the debuff more than once
					data.object.unstoppableApplied = true;

				} else	{
					// if the enemy isn't in range and the passive has been applied removing the 15% debuff and reset the temp variable
					if (data.object.unstoppableApplied)	{

						obj.bonusArmor -= data.object.unstoppableArmorStolen;			// Removing the solen armor from OBJ
						data.object.bonusArmor += data.object.unstoppableArmorStolen;	// Giving the stolen armor to the owner
						data.object.tempBuffUnstoppable.delete();						// Deleting the image shown in data.obj HUD
						obj.unstoppableTotalArmorStolen -= data.object.unstoppableArmorStolen; // Update stats


						data.object.unstoppableApplied = false;
					}
				}
				
				/* Showing the armor gained on the owner of the item HUD */
				obj.tempBuffOwnerUnstoppable = new Buff(7272, `+${floor(obj.unstoppableTotalArmorStolen)}`, this.img, obj, `This unit has stolen <purple>${floor(obj.unstoppableTotalArmorStolen)}</purple> armor <br /><br /> Source: ${obj.name}`);

			}
		}
		unstoppable.antiBuff = function(obj)	{
			obj.bonusArmor -= 30;
			obj.hp -= 350;
			obj.maxHp -= 350;
			obj.tempBuffOwnerUnstoppable.delete();	// Removing the stat indicator from HUD

			// Removing the granted AD and armor from passive
			/*var tempArmor = 0;
			var tempAD = 0;
			for (let i = 0; i < obj.itemsDataHolder.length; i++)	{
				if (obj.itemsDataHolder[i].item == this.name)	{
					tempArmor = obj.itemsDataHolder[i].data1;
					tempAD = obj.itemsDataHolder[i].data2;
					obj.itemsDataHolder.splice(i, 1);
				}
			}
			obj.bonusArmor -= tempArmor;
			obj.bonusAD -= tempAD;*/

		};

		// Phantom dancer
		let phantom =	new Item(
								"Phantom dancer",
								2800,
								"Data/Images/Phantom_Dancer_item.png",
								"UNIQUE PASSIVE: Grants +20% critical strike chance and 45% attack speed"
							);	

		phantom.buff = function(obj)	{	
			obj.critChance += 0.20;

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.45;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= obj.attackSpeed * 0.45;
		};

		phantom.antiBuff = function(obj)	{
			obj.critChance -= 0.20;

			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;

		};

		// Rapid fire canon
		let rapidFireCanon =	new Item(
								"Rapid fire canon",
								2800,
								"Data/Images/Rapid_Firecannon_item.png",
								`UNIQUE PASSIVE: Grants +25% <red> (+${object.range * 0.25}) </red> bonus range,  20% critical strike chance and 30% attack speed`
							);	

		rapidFireCanon.buff = function(obj)	{	
			obj.range *= 1.25;
			obj.critChance += 0.20;
			

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.30;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= obj.attackSpeed * 0.30;
		};

		rapidFireCanon.antiBuff = function(obj)	{
			obj.range /= 1.25;
			obj.critChance -= 0.20;
			

			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;

		};

		// Mortal reminder
		let mortal_reminder =	new Item(
								"Mortal reminder",
								2800,
								"Data/Images/Mortal_Reminder_item.png",
								`UNIQUE PASSIVE: Grants +25 attack damage and +25% armor penetration <br /> <br />
								 UNIQUE PASSIVE: Reduces the healing of all enemies in your range <red>(${object.range})</red> by 40%`
							);	

		mortal_reminder.buff = function(obj)	{	
			obj.armorPen += 0.25;		// +25% armor penetration
			obj.bonusAD += 25;			// +25 attack damage
		};

		mortal_reminder.passive = function(obj)	{

			/* looping throw the distance from OBJ to see if any enemy is in range */
			for (let data of obj.distanceFromObjects)	{

				if (data.distance <= obj.range && data.hp > 0)	{

					/* Appying the -40% healing debuff */
					if (!data.object.monrtalReminderApplied)	{
						data.object.healingReduction += 0.40;
					}

					/* Showing the Debuff on data.object HUD and storing it to delete it after */
					data.object.tempBuffMR = new Buff(2643, "", this.img, data.object, `This unit healing from all sources is reduces by 40% <br /><br /> Source: ${obj.name}`);

					/* Storing a temp variable to not apply the debuff more than once */
					data.object.monrtalReminderApplied = true;

				} else	{

					/* if the enemy isn't in range and the passive has been applied removing the 40% debuff and reset the temp variable */
					if (data.object.monrtalReminderApplied)	{

						data.object.healingReduction -= 0.40;		// Removing the healing reduction
						data.object.tempBuffMR.delete();			// Deleting the image from data.object HUD

						data.object.monrtalReminderApplied = false;
					}
				}
			}		

		}

		mortal_reminder.antiBuff = function(obj)	{
			obj.armorPen -= 0.25;		// -25% armor penetration
			obj.bonusAD -= 25;			// -25 attack damage
		};

		// Essence reaver
		let essence_Reaver =	new Item(
								"Essence reaver",
								3000,
								"Data/Images/Essence_Reaver_item.png",
								`UNIQUE PASSIVE: Grants +70 attack damage and +20% critical strike chance <br /><br /> UNIQUE PASSIVE: Grants attack damage equals to your base armor <purple> (+${floor(object.baseArmor)}) </purple> if you fall below 50% <green>(${floor(object.maxHp * 0.50)})</green> maximum health`
							);	

		essence_Reaver.buff = function(obj)	{	
			obj.bonusAD += 70;
			obj.critChance += 0.20;
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
			obj.critChance -= 0.20;

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
								`UNIQUE PASSIVE: Grants +100 armor and +250 health <br />
								 UNIQUE PASSIVE - <b>cold steal</b>: reduce the attack speed of all enemies in your range <red>(${object.range})</red> by 45% <br />
								 UNIQUE PASSIVE - <b>Freeze</b>: reduce the projectile speed of all enemies in your range <red>(${object.range})</red> by 75%`
		);	

		frozen_heart.buff = function(obj)	{	
			obj.bonusArmor += 100;
			obj.maxHp += 250;
			obj.hp += 250;	
		};

		frozen_heart.passive = function(obj)	{

			// looping throw the distance from OBJ to see if any enemy is in range
			for (let data of obj.distanceFromObjects)	{

				if (data.distance <= obj.range)	{

					// Appying the -15% attack speed debuff
					if (!data.object.frozenDebuffApplied)	{
						data.object.frozenDebuffAmount = data.object.attackSpeed * 0.45;
						data.object.attackSpeed += data.object.frozenDebuffAmount;
						data.object.bulletSpeed *= 0.25;
					}

					// Showing the snowflake indicator above the affected object
					new Image("Data/Images/snowflake.png", data.object.x + 25, data.object.y - 75, 35, 35, "snowflake").draw();

					// Showing the Debuff on data.object HUD and storing it to delete it after
					data.object.tempBuffFH = new Buff(9676, "", this.img, data.object, `This unit attack speed is reduced by 45% and its projectile speed is reduced by 75% <br /><br /> Source: ${obj.name}`);

					// Storing a temp variable to not apply the debuff more than once
					data.object.frozenDebuffApplied = true;

				} else	{

					// if the enemy isn't in range and the passive has been applied removing the 15% debuff and reset the temp variable
					if (data.object.frozenDebuffApplied)	{

						data.object.attackSpeed -= data.object.frozenDebuffAmount;	// Removing the attack speed debuff
						data.object.bulletSpeed /= 0.25;							// Removing the bullet slow
						data.object.tempBuffFH.delete();							// Deleting the image from data.object HUD

						data.object.frozenDebuffApplied = false;					// Reset variable
					}
				}
			}		

		}

		frozen_heart.antiBuff = function(obj)	{
			obj.bonusArmor -= 100;
			obj.maxHp -= 250;
			obj.hp -= 250;
		};

		
		// Iceborn Gauntlet
		let Iceborn_Gauntlet =	new Item(
								"Iceborn Gauntlet",
								2700,
								"Data/Images/Iceborn_Gauntlet_item.png",
								`UNIQUE PASSIVE - <b> Giant strength </b> : Become immute to damage, gain <orange>+${object.bonusAD}</orange> AD and <red>+${floor((1 - object.critChance) * 100)}%</red> critical strike chance if you fall below 5% <green>(${floor(object.maxHp * 0.05)})</green> maximum health for <b>${3 + level}</b> seconds. After the duration, gain <purple>+${object.baseArmor}</purple> <b>base</b> armor (30 seconds cooldown)`
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
					if (!obj.IcebornGauntletArmorGranted)	{
						const TEMP = obj.baseArmor;
						obj.baseArmor *= 2;
						obj.IcebornGauntletArmorGranted = true;	// To not grante armor more than once

						obj.itemsDataHolder.push({
							item: "Iceborn Gauntlet",
							data: TEMP
						});
					}

				}, 3000 + (level * 1000) );

				// After 30 second delay removing this item from the item buff applied
				setTimeout(function()	{
					for (let element of obj.itemsPassiveApplied)	{
						if (element.name == "Iceborn Gauntlet")	{
							obj.itemsPassiveApplied.splice(obj.itemsPassiveApplied.indexOf(element), 1);
						}
					}
				}, 30000);
				
				// Adding the item the list of buffs applied
				new Ability(5788, 30, this.img, obj, `Iceborn Gauntlet is on cooldown and connot be triggered yet <br /> <br />Source: ${obj.name}`);	// Cooldown
				new Ability(6349, 3 + level, this.img, obj, `This unit is immute to damage <br /><br /> Source: ${obj.name}`);							// Duration
				
				
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
								`UNIQUE PASSIVE: Grants +40 attack damage, +12% life steal and +40% attack speed <br /> <br /> UNIQUE PASSIVE: damaging an enemy applies 8% of their current health as bonus physical damage`
							);	

		bork.buff = function(obj)	{	
			obj.bonusAD += 40;
			obj.bonusLifeSteal += 0.12;

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.40;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= ASGRANTED;

		};

		bork.antiBuff = function(obj)	{
			obj.bonusAD -= 40;
			obj.bonusLifeSteal -= 0.12;
			
			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;
		};

		// The true alpha
		let t1 =	new Item(
								"The true alpha",
								1995,
								"Data/Images/t1.jpg",
								`UNIQUE PASSIVE - <b>Growing force</b>: Gain 10% <orange>(+${floor((object.maxHp - object.hp) * 0.10)})</orange> of your missing health as attack damage
								<br />
								UNIQUE PASSIVE - <b>Blood thirst</b>: Grants 1% life steal per 100 missing health <green>(+${floor((object.maxHp - object.hp) / 100)}%)</green>`
							);	

		t1.buff = function(obj)	{
			
			// Adding a slot of data to this item
			obj.itemsDataHolder.push({
				item: this.name,
				data1: 0,
				data2: 0
			});
			
		};

		t1.passive = function(obj)	{

			// Calculating the AD to grant
			const GRANTAD = floor((obj.maxHp - obj.hp) * 0.10);
			const GRANTLS = floor((obj.maxHp - obj.hp) / 100) / 100;

			// Verifying this item's temp variables 
			if (!obj.lastADaddedForT1)	{
				obj.lastADaddedForT1 = 0;
			}

			if (!obj.lastLSaddedForT1)	{
				obj.lastLSaddedForT1 = 0;
			}

			// Adding the buffs ( Calculating the amount that should be added with amountThaShouldBeAdded - LastAmountAdded. For example, if should add 12 AD and 10 AD already has been granted, it will only grand 2 AD )
			obj.bonusAD += (GRANTAD - obj.lastADaddedForT1);
			obj.bonusLifeSteal += (GRANTLS - obj.lastLSaddedForT1);
			
			// Adding the amount of buffs granted to remove the same amount when the item is sold
			for (let element of obj.itemsDataHolder)	{
				if (element.item == this.name)	{
					element.data1 += (GRANTAD - obj.lastADaddedForT1);
					element.data2 += (GRANTLS - obj.lastLSaddedForT1);
				}
			}

			// Refreshing the last amount of buffs granted
			obj.lastADaddedForT1 = GRANTAD;
			obj.lastLSaddedForT1 = GRANTLS;	

		}

		t1.antiBuff = function(obj)	{

			// Descovering the total amount of AD and Lifesteal granted
			var totalADgranted = 0;
			var totalLSgranted = 0;

			for (let element of obj.itemsDataHolder)	{
				if (element.item == this.name)	{
					totalADgranted = element.data1;
					totalLSgranted = element.data2;
					obj.itemsDataHolder.splice(obj.itemsDataHolder.indexOf(element), 1);
				}
			}

			// Removing these amounts
			obj.bonusAD -= totalADgranted;
			obj.bonusLifeSteal -= totalLSgranted;
			
			// Reseting temp variables
			obj.lastADaddedForT1 = 0;
			obj.lastLSaddedForT1 = 0;

		};

		// Statikk Shiv
		let shiv =	new Item(
								"Statikk Shiv",
								2600,
								"Data/Images/Statikk_Shiv_item.png",
								`UNIQUE PASSIVE: Grants +20% critical strike chance and 40% attack speed <br /> <br />
								 UNIQUE PASSIVE: Basic attacks deal 10% of target missing health as bonus <b>physical</b> damage`
		);	

		shiv.buff = function(obj)	{	
			obj.critChance += 0.2;

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.40;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= ASGRANTED;
		};

		shiv.antiBuff = function(obj)	{
			obj.critChance -= 0.2;

			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;
		};

		// Runaan's Hurricane
		let hurricane =	new Item(
								"Runaan's Hurricane",
								2600,
								"Data/Images/Runaan_s_Hurricane_item.png",
								`UNIQUE PASSIVE: Grants +20% critical strike chance and 40% attack speed <br /><br />
								 UNIQUE PASSIVE: Damaging an enemy shoots 3 additional bullets (${(5 * (object.attackSpeed * 1.66)).toFixed(1)} seconds cooldown)`
		);	

		hurricane.buff = function(obj)	{	
			obj.critChance += 0.2;
			
			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.40;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= ASGRANTED;
		};

		hurricane.passive = function(obj)	{

			if (!obj.hurricaneApplied)	{
				obj.tempBuffHurricane = new Buff(0534, "", this.img, obj, `Your next basic attack will split into 3 bullets. These bullets apply on-hit effects <br /><br />Source: ${this.name} (${obj.name})`);
			} else	{
				obj.tempBuffHurricane.delete();
			}			

		}

		hurricane.antiBuff = function(obj)	{
			obj.critChance -= 0.2;
			obj.tempBuffHurricane.delete();
			
			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;
		};

		// Berserker's Greaves
		let berserker =	new Item(
								"Berserker's Greaves",
								1100,
								"Data/Images/Berserker_s_Greaves_item.png",
								"UNIQUE PASSIVE: Grants +35% attack speed <br /><br /> UNIQUE PASSIVE - <b>Swift</b>: grants +10 mouvement speed"
		);	

		berserker.buff = function(obj)	{
			obj.ms += 10;

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.35;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= ASGRANTED;
		};

		berserker.antiBuff = function(obj)	{
			obj.ms -= 10;
			
			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;
		};

		
		// Stormrazor
		let stormrazor =	new Item(
								"Stormrazor",
								2900,
								"Data/Images/stormrazor_item.png",
								`UNIQUE PASSIVE: Grants +60 attack damage and +30% attack speed`
		);	

		stormrazor.buff = function(obj)	{
			obj.bonusAD += 60;

			// Storing the attack speed granted
			const ASGRANTED = obj.attackSpeed * 0.30;
			obj.itemsDataHolder.push({
				item: this.name,
				data: ASGRANTED
			});

			// Grating the attack speed
			obj.attackSpeed -= ASGRANTED;
		};

		stormrazor.antiBuff = function(obj)	{
			obj.bonusAD -= 60;

			// Removing the attack speed granted
			const TEMP = getItemData(obj, this.name);
			obj.attackSpeed += TEMP.data;
		};

		// Youmuu's Ghostblade
		let youmuus =	new Item(
								"Youmuu's Ghostblade",
								2700,
								"Data/Images/Youmuu_s_Ghostblade_item.png",
								`UNIQUE PASSIVE: Grants +55 attack damage and +18 lithality <br /> <br />
								 UNIQUE PASSIVE - <b>Swift</b>: Grants +5 movement speed`
		);	

		youmuus.buff = function(obj)	{
			obj.bonusAD += 55;
			obj.lithality += 18;
			obj.ms += 5;
		};

		youmuus.antiBuff = function(obj)	{
			obj.bonusAD -= 55;
			obj.lithality -= 18;
			obj.ms -= 5;
		};

		// Duskblade of Draktharr
		let duskblade =	new Item(
								"Duskblade of Draktharr",
								2900,
								"Data/Images/Duskblade_of_Draktharr_item.png",
								`UNIQUE PASSIVE: Grants +60 attack damage and +21 lithality <br /> <br />
								 UNIQUE PASSIVE - <b>Nightmare</b>: Every ${(7 * object.attackSpeed).toFixed(1)} seconds, your next basic attack will deal <orange>${floor(object.ad * 0.60) + 10}</orange> bonus damage`
		);	

		duskblade.buff = function(obj)	{
			obj.bonusAD += 60;
			obj.lithality += 21;

		};

		duskblade.passive = function(obj)	{

			// Showing the buff indicator on HUD
			if (!obj.duskbladeApplied)	{
				obj.tempBuffDusk = new Buff(5782, "", this.img, obj, `This unit next basic attack will deal <orange>${10 + obj.ad * 0.60}</orange> bonus physical damage <br /><br /> Source: ${this.name} (${obj.name})`);
			} else	{
				obj.tempBuffDusk.delete();
			}			

		}

		duskblade.antiBuff = function(obj)	{
			obj.bonusAD -= 60;
			obj.lithality -= 21;
			obj.tempBuffDusk.delete();
		};

		/***********************
		 **** Sorting items ****
		 **********************/
		allItmes.sort(function(a, b){
			var x = a.name.toLowerCase();
			var y = b.name.toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		});
	}

	loadItmes(player);
	
	
	