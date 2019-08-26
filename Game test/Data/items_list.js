/***
 * 
 *   List of all available items in the game
 * 
 */

     function getItemsList(object)  {

          const items_list = [
               {
                    name: "Sunfire Cape",
                    cost: 2900,
                    icon: "Data/Images/Sunfire_Cape_item.png",
                    description: "UNIQUE PASSIVE: Grants 425 health and 50 armor",
                    buff: function(obj)	{
                         obj.hp += 425;
                         obj.maxHp += 425;
                         obj.bonusArmor += 50;
                    },
                    antibuff: function(obj)	{
                         obj.hp -= 425;
                         obj.maxHp -= 425;
                         obj.bonusArmor -= 50;
                    }
               },
               {
                    name: "Warmogs Armor",
                    cost: 2850,
                    icon: "Data/Images/Warmog's_Armor_item.png",
                    description: `UNIQUE PASSIVE: Grants +200% <green> (+${((object.hpRegen * 3 - object.hpRegen) * 100).toFixed(2)}) </green> health regenration<br /><br />UNIQUE PASSIVE: Grants 800 health`,
                    buff: function(obj)	{
                         obj.hpRegen *= 3;
                         obj.hp += 800;
                         obj.maxHp += 800;
                    },
                    antibuff: function(obj)	{
                         obj.hpRegen /= 3;
                         obj.hp -= 800;
                         obj.maxHp -= 800;
                    }
               },
               {
                    name: "Tear of the Goddess",
                    cost: 850,
                    icon: "Data/Images/Tear_of_the_Goddess_item.png",
                    description: `UNIQUE PASSIVE: Grants +100% <blue>(+${(object.energyRegen * 100).toFixed(2)})</blue> energy regenration and reduces enegy costs by 20% <blue>(-${object.jumpCost * 0.20})</blue> <br /><br /> UNIQUE PASSIVE: Grants +20% <blue>(+${object.maxEnergy * 0.20})</blue> bonus energy`,
                    buff: function(obj)	{
                         obj.energyRegen *= 2;
                         obj.jumpCost *= 0.80;
                         obj.maxEnergy *= 1.20;
                    },
                    antibuff: function(obj)	{
                         obj.energyRegen /= 2;
                         obj.jumpCost /= 0.80;
                         obj.maxEnergy /= 1.20;
                    }
               },
               {
                    name: "Thornmail",
                    cost: 2900,
                    icon: "Data/Images/Thornmail_item.png",
                    description: "UNIQUE PASSIVE: Grants +80 armor and +250 health <br /> <br /> UNIQUE PASSIVE: Reflect 15% of the damage received (after resitances) as TRUE damage and applies the <b>Glorious Executioner</b> to the attacker",
                    buff: function(obj)	{
                         obj.hp += 250;
                         obj.maxHp += 250;
                         obj.bonusArmor += 80;
                    },
                    antibuff: function(obj)	{
                         obj.hp -= 250;
                         obj.maxHp -= 250;
                         obj.bonusArmor -= 80;
                    },
                    reflectEffect: function(from, to)     {

                         // Reflecting 10% of the damage received as TRUE damage to the attacker
                         to.damage(from, {
                              value: from.statistics.lastDamageTaken * 0.15,
                              type: "true",
                              description: "Thornmail",
                              allowCrit: false,
                              forceCrit: from.statistics.lastAttackHasCrit
                         });

                         // Apply Glorious Executioner to attacker
                         to.reduceHealing = true;

                         setTimeout(function()    {
                              to.reduceHealing = false;
                         }, 5000);

                         new Ability(464565, 5, this.img, to, `This unit is affected by the <b>Glorious Executioner</b> <br /> <br />Source: ${this.name} (${from.name})`);
                         
                    }
               },
               {
                    name: "Infinity Edge",
                    cost: 3400,
                    icon: "Data/Images/Infinity_Edge_item.png",
                    description: "UNIQUE PASSIVE: Grants 80 attack damage and 20% critical strike chance<br /><br />UNIQUE PASSIVE: critical strikes deal 200% <br /> damage instead of <b> 150% </b>",
                    buff: function(obj)	{
                         obj.critChance += 0.20;
                         obj.bonusAD += 80;
                         obj.critMultiplier += 0.5;
                    },
                    antibuff: function(obj)	{
                         obj.critChance -= 0.20;
                         obj.bonusAD -= 80;
                         obj.critMultiplier -= 0.5;
                    }
               },
               {
                    name: "The Bloodthirster",
                    cost: 3500,
                    icon: "Data/Images/The_Bloodthirster_item.png",
                    description: `UNIQUE PASSIVE: Grants +80 attack damage and 20% life steal <br /> UNIQUE PASSIVE: Grants a shield equals to 12% <green> (${floor(object.maxHp * 0.12)}) </green> of your maxium health if you fall below 30% <green> (${floor(object.maxHp * 0.30)}) </green> maximum health (20 seconds cooldown)`,
                    buff: function(obj)	{
                         obj.bonusLifeSteal += 0.2;
                         obj.bonusAD += 80;
                    },
                    passive: 	function(obj)	{
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
                              obj.itemsPassiveApplied.push(this);
                         }		
                    },
                    antibuff: function(obj)	{
                         obj.bonusLifeSteal -= 0.2;
                         obj.bonusAD -= 80;
                    }
               },
               {
                    name: "Sterak's Gage",
                    cost: 3200,
                    icon: "Data/Images/Sterak_s_Gage_item.png",
                    description: `UNIQUE PASSIVE: Grants a shield equals to 50% <green> (${floor((object.maxHp - object.hp) * 0.50)}) </green> of your missing health if you fall below 10% <green> (${floor(object.maxHp * 0.10)}) </green> maximum health (25 seconds cooldown)`,
                    buff: function(obj)	{	
                    },
                    passive: 	function(obj)	{
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
                              obj.itemsPassiveApplied.push(this);
                         }		
                    },
                    antibuff: function(obj)	{
                    }
               },
               {
                    name: "Lord Dominik's Regards",
                    cost: 2800,
                    icon: "Data/Images/Lord_Dominik's_Regards_item.png",
                    description: "UNIQUE PASSIVE: Grants +35% armor penetration",
                    buff: function(obj)	{	
                         obj.armorPen += 0.35;
                    },
                    antibuff: function(obj)	{
                         obj.armorPen -= 0.35;
                    }
               },
               {
                    name: "The unstoppable force",
                    cost: 2600,
                    icon: "Data/Images/Unstoppable.jpg",
                    description: `UNIQUE PASSIVE: Grants +30 armor and +350 health <br /> <br /> 
                    UNIQUE PASSIVE: Steals 50% of the armor of all enemies in your range <red>(${object.range})</red>`,
                    buff: function(obj)	{	
                         obj.bonusArmor += 30;
                         obj.hp += 350;
                         obj.maxHp += 350;
                         
                         obj.unstoppableTotalArmorStolen = 0;
          
                    },
                    passive: function(obj)	{

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
                                   //new Image("https://i.imgur.com/S9QSWAj.png", data.object.x + 25, data.object.y - 75, 35, 35, "trihard").draw();
          
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
                    },
                    antibuff: function(obj)	{
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
          
                    }
               },
               {
                    name: "Phantom dancer",
                    cost: 2800,
                    icon: "Data/Images/Phantom_Dancer_item.png",
                    description: "UNIQUE PASSIVE: Grants +20% critical strike chance and 45% attack speed",
                    buff: function(obj)	{	
                         obj.critChance += 0.20;
           
                         // Grating the attack speed
                         obj.attackSpeed += 0.45;
                    },
                    antibuff: function(obj)	{
                         obj.critChance -= 0.20;
 
                         obj.attackSpeed -= 0.45;          
                    }
               },
               {
                    name: "Rapid fire canon",
                    cost: 2800,
                    icon: "Data/Images/Rapid_Firecannon_item.png",
                    description: `UNIQUE PASSIVE: Grants +25% <red> (+${object.range * 0.25}) </red> bonus range,  20% critical strike chance and 30% attack speed`,
                    buff: function(obj)	{	
                         obj.range *= 1.25;
                         obj.critChance += 0.20;
           
                         // Grating the attack speed
                         obj.attackSpeed += 0.30;
                    },
                    antibuff: function(obj)	{
                         obj.range /= 1.25;
                         obj.critChance -= 0.20;
                         
                         obj.attackSpeed -= 0.30;
          
                    }
               },
               {
                    name: "Mortal reminder",
                    cost: 2800,
                    icon: "Data/Images/Mortal_Reminder_item.png",
                    description: "UNIQUE PASSIVE: Grants +25 attack damage and +25% armor penetration <br /> <br /> UNIQUE PASSIVE: Applies the <b>Glorious Executioner</b> to enemies hit by basic attacks for 3 seconds",
                    buff: function(obj)	{	
                         obj.armorPen += 0.25;		// +25% armor penetration
                         obj.bonusAD += 25;			// +25 attack damage
                    },
                    passive: function(obj)	{

                         /* looping through the distance from OBJ to see if any enemy is in range */
                         /*for (let data of obj.distanceFromObjects)	{
                              if (data.distance <= obj.range && data.object.hp > 0)	{
                                   // Appying the -40% healing debuff
                                   data.object.reduceHealing = true;
                              } else	{
                                   // Removing the healing reduction
                                   data.object.reduceHealing = false;
                              }
                         }*/		
          
                    },
                    antibuff: function(obj)	{
                         obj.armorPen -= 0.25;		// -25% armor penetration
                         obj.bonusAD -= 25;			// -25 attack damage
                    },
                    onhit: function(from, to)     {

                         to.reduceHealing = true;

                         setTimeout(function()    {
                              to.reduceHealing = false;
                         }, 3000);

                         // HUD
                         new Ability(89788, 3, this.img, to, `This unit is affected by the <b>Glorious Executioner</b> <br /> <br />Source: ${this.name} (${from.name})`);

                    }
               },
               {
                    name: "Essence reaver",
                    cost: 3000,
                    icon: "Data/Images/Essence_Reaver_item.png",
                    description: `UNIQUE PASSIVE: Grants +70 attack damage and +20% critical strike chance <br /><br /> UNIQUE PASSIVE: Grants attack damage equals to your base armor <purple> (+${floor(object.baseArmor)}) </purple> if you fall below 50% <green>(${floor(object.maxHp * 0.50)})</green> maximum health`,
                    buff: function(obj)	{	
                         obj.bonusAD += 70;
                         obj.critChance += 0.20;
                    },
                    passive: function(obj)	{

                         if (obj.hp < obj.maxHp * 0.5)	{

                              if (!obj.essenceReaverADGranted)   {
                                   obj.bonusAD += obj.baseArmor;
               
                                   // Storing the granted amount
                                   obj.itemsDataHolder[this.name] = obj.baseArmor;

                                   // Show AD granted on HUD
                                   obj.tempEssenceReaverHUD = new Buff(46877, `${floor(obj.baseArmor)}`, this.img, obj, `This unit's AD is increased by <orange>${floor(obj.baseArmor)}</orange><br />Source: ${this.name}`);

                                   obj.essenceReaverADGranted = true;
                              }
                         } else    {

                              if (obj.essenceReaverADGranted)    {
                                   obj.bonusAD -= obj.itemsDataHolder[this.name];
                                   obj.tempEssenceReaverHUD.delete();

                                   obj.essenceReaverADGranted = false;
                              }

                         }
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 70;
                         obj.critChance -= 0.20;
          
                         // Removing the granted AD amount
                         var temp = obj.itemsDataHolder[this.name];
                         delete obj.itemsDataHolder[this.name];
                         if (temp) {
                              obj.bonusAD -= temp;
                         }

                         // Delete icon from HUD
                         if (obj.tempEssenceReaverHUD) {
                              obj.tempEssenceReaverHUD.delete();
                         }
          
                    }
               },
               {
                    name: "Frozen heart",
                    cost: 2700,
                    icon: "Data/Images/Frozen_Heart_item.png",
                    description: `UNIQUE PASSIVE: Grants +100 armor and +250 health <br />
                    UNIQUE PASSIVE - <b>cold steal</b>: reduce the attack speed of all enemies in your range <red>(${object.range})</red> by 45% <br />
                    UNIQUE PASSIVE - <b>Freeze</b>: basic attacks have 10% (+${(object.critChance > 0.40 ? 0.40 : floor(object.critChance)) * 100}%) chance to stun the targetted enemy for 1.5 (+<pink>${(object.ap * 0.001).toFixed(2)}</pink>) seconds`,
                    buff: function(obj)	{	
                         obj.bonusArmor += 100;
                         obj.maxHp += 250;
                         obj.hp += 250;	
                    },
                    passive: function(obj)	{

                         // looping throw the distance from OBJ to see if any enemy is in range
                         for (let data of obj.distanceFromObjects)	{
          
                              if (data.distance <= obj.range)	{
          
                                   // Appying the -45% attack speed debuff
                                   if (!data.object.frozenDebuffApplied)	{
                                        data.object.frozenDebuffAmount = data.object.attackSpeed * 0.45;
                                        data.object.attackSpeed -= data.object.frozenDebuffAmount;
                                   }
          
                                   // Showing the snowflake indicator above the affected object
                                   new Image("Data/Images/snowflake.png", data.object.x + 25, data.object.y - 75, 35, 35, "snowflake").draw();
          
                                   // Showing the Debuff on data.object HUD and storing it to delete it after
                                   data.object.tempBuffFH = new Buff(9676, "", this.img, data.object, `This unit attack speed is reduced by 45%<br /><br /> Source: ${this.name} (${obj.name})`);
          
                                   // Storing a temp variable to not apply the debuff more than once
                                   data.object.frozenDebuffApplied = true;
          
                              } else	{
          
                                   // if the enemy isn't in range and the passive has been applied removing the 15% debuff and reset the temp variable
                                   if (data.object.frozenDebuffApplied)	{
          
                                        data.object.attackSpeed += data.object.frozenDebuffAmount;	// Removing the attack speed debuff
                                        data.object.tempBuffFH.delete();							// Deleting the image from data.object HUD
          
                                        data.object.frozenDebuffApplied = false;					// Reset variable
                                   }
                              }
                         }		
          
                    },
                    antibuff: function(obj)	{
                         obj.bonusArmor -= 100;
                         obj.maxHp -= 250;
                         obj.hp -= 250;

                         for (let temp of monsters)  {
                              if (temp.frozenDebuffApplied)   {
                                   temp.attackSpeed += temp.frozenDebuffAmount;
                                   temp.tempBuffFH.delete();
                                   temp.frozenDebuffApplied = false;
                              }
                         }

                         if (player.frozenDebuffApplied)   {
                              player.attackSpeed += player.frozenDebuffAmount;
                              player.tempBuffFH.delete();
                              player.frozenDebuffApplied = false;
                         }
                         
                    },
                    onhit: function(from, to)     {

                         var chance = from.critChance + 0.10 > 0.50 ? 0.50 : from.critChance + 0.10;

                         if ( random(0, 100, true) <= chance * 100 )   {

                              to.stunned = true;

                              var stunDuration = 1.5 + object.ap * 0.001;

                              setTimeout(function()    {
                                   to.stunned = false;
                              }, stunDuration * 1000);

                              // Show stun duration on HUD
                              new Ability(54544898, stunDuration, "Data/Images/Stun_icon.png", to, `This unit is stunned<br /><br />Source: ${this.name} (${from.name})`);

                         }

                    }
               },
               {
                    name: "Iceborn Gauntlet",
                    cost: 2700,
                    icon: "Data/Images/Iceborn_Gauntlet_item.png",
                    description: `UNIQUE PASSIVE: grants +45 armor and immunity 
                                   <br /> UNIQUE PASSIVE - <b>Giant strength</b> : while you are at 20% max health, gain <orange>+${object.bonusAD}</orange> AD and <red>+${floor((1 - object.critChance) * 100)}%</red> critical strike chance for <b>${3 + level}</b> seconds. After the duration, gain <purple>+${object.baseArmor}</purple> <b>base</b> armor (15 seconds cooldown)`,
                    buff: function(obj)	{	
                         obj.bonusArmor += 45;
                         obj.immute = true;
                         obj.icebornImmunityExpired = false;
                    },
                    passive: function(obj)	{

                         if (!obj.icebornImmunityExpired)     {
                              obj.immute = true;
                         } else    {
                              obj.immute = false;
                         }

                         if (obj.hp <= obj.maxHp * 0.20)	{

                              obj.icebornImmunityExpired = true;
          
                              const CURRENTAD = obj.bonusAD;
                              const CURRENTCRIT = obj.critChance;
                              obj.bonusAD += CURRENTAD;
                              obj.critChance = 1;
          
                              setTimeout(function()	{
                                   obj.immute = false;
                                   obj.heal(obj.maxHp * 0.20);
          
                                   // Removing the AD and the crit
                                   obj.bonusAD -= CURRENTAD;
                                   obj.critChance = CURRENTCRIT;                                  
          
                                   // Adding the armor
                                   if (!obj.IcebornGauntletArmorGranted)	{
                                        const TEMP = obj.baseArmor;
                                        obj.baseArmor *= 2;
                                        obj.IcebornGauntletArmorGranted = true;	// To not grante armor more than once
          
                                        obj.itemsDataHolder[this.name] = TEMP

                                   }
          
                              }, 3000 + (level * 1000) );
          
                              // After 30 second delay removing this item from the item buff applied
                              setTimeout(function()	{
                                  obj.icebornImmunityExpired = false;
                              }, 15 * 1000);
                              
                              // Adding the item the list of buffs applied
                              new Ability(5788, 15, this.img, obj, `Iceborn Gauntlet is on cooldown and connot be triggered yet <br /> <br />Source: ${obj.name}`);	// Cooldown
                              new Ability(6349, 3 + level, this.img, obj, `This unit is immute to damage <br /><br /> Source: ${obj.name}`);							// Duration
                         }		
                    },
                    antibuff: function(obj)	{
                         obj.bonusArmor -= 45;
                         obj.immute = false;
          
                         // Removing the armor granted by passive
                         var temp = obj.itemsDataHolder[this.name];
                         delete obj.itemsDataHolder[this.name];

                         if (temp != undefined && temp != null)  {
                              obj.baseArmor -= temp;
                         }          
                    }
               },
               {
                    name: "Blade of the ruined King",
                    cost: 3200,
                    icon: "Data/Images/Blade_of_the_Ruined_King_item.png",
                    description: `UNIQUE PASSIVE: Grants +40 attack damage, +12% life steal and +40% attack speed <br /> <br /> UNIQUE PASSIVE: damaging an enemy applies 8% of their current health as bonus physical damage`,
                    buff: function(obj)	{	
                         obj.bonusAD += 40;
                         obj.bonusLifeSteal += 0.12;
          
                         // Grating the attack speed
                         obj.attackSpeed += 0.40;
          
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 40;
                         obj.bonusLifeSteal -= 0.12;
                         
                         // Removing the attack speed granted
                         obj.attackSpeed -= 0.40;
                    },
                    onhit: function(from, to)   {
                         // Applying 8% of targets current health as bonus physical damage
                         to.damage(from, {value: to.hp * 0.08, type: "physical", description: "Blade of the ruined King"});
                    }
               },
               {
                    name: "The true alpha",
                    cost: 1995,
                    icon: "Data/Images/t1.jpg",
                    description: `UNIQUE PASSIVE - <b>Growing force</b>: Gain 10% <orange>(+${floor((object.maxHp - object.hp) * 0.10)})</orange> of your missing health as attack damage
                    <br /> UNIQUE PASSIVE - <b>Blood thirst</b>: Grants 1% life steal per 100 missing health <green>(+${floor((object.maxHp - object.hp) / 100)}%)</green>`,
                    buff: function(obj)	{
			
                         // Adding a slot of data to this item
                         obj.itemsDataHolder[this.name] = {
                              data1: 0,
                              data0: 0
                         }
                         
                    },
                    passive: function(obj)	{

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
                         obj.itemsDataHolder[this.name].data1 = (GRANTAD - obj.lastADaddedForT1)
                         obj.itemsDataHolder[this.name].data2 = (GRANTLS - obj.lastLSaddedForT1)
          
                         // Refreshing the last amount of buffs granted
                         obj.lastADaddedForT1 = GRANTAD;
                         obj.lastLSaddedForT1 = GRANTLS;	
          
                    },
                    antibuff: function(obj)	{

                         // Descovering the total amount of AD and Lifesteal granted
                         var totalADgranted = obj.itemsDataHolder[this.name].data1;
                         var totalLSgranted = obj.itemsDataHolder[this.name].data2;
                         
                         delete obj.itemsDataHolder[this.name];
          
                         // Removing these amounts
                         obj.bonusAD -= totalADgranted;
                         obj.bonusLifeSteal -= totalLSgranted;
                         
                         // Reseting temp variables
                         obj.lastADaddedForT1 = 0;
                         obj.lastLSaddedForT1 = 0;
          
                    }
               },
               {
                    name: "Statikk Shiv",
                    cost: 2600,
                    icon: "Data/Images/Statikk_Shiv_item.png",
                    description: `UNIQUE PASSIVE: Grants +20% critical strike chance and 40% attack speed <br /> <br /> UNIQUE PASSIVE: Basic attacks deal 60 <orange>(+${floor(object.bonusAD * 1.20)})</orange> <pink>(+${floor(object.ap * 0.80)})</pink> bonus onhit <b>magic</b> damage`,
                    buff: function(obj)	{	
                         obj.critChance += 0.2;
            
                         // Grating the attack speed
                         obj.attackSpeed += 0.40;
                    },
                    antibuff: function(obj)	{
                         obj.critChance -= 0.2;
                         
                         obj.attackSpeed -= 0.40;
                    },
                    onhit: function(from, to)     {

                         var damageValue = 60 + (from.bonusAD * 1.20) + (from.ap * 0.80);

                         to.damage(from, {value: damageValue, type: "magic", description: "Statikk Shiv", allowCrit: false, forceCrit: to.statistics.lastAttackHasCrit});
                    }
               },
               {
                    name: "Runaan's Hurricane",
                    cost: 2600,
                    icon: "Data/Images/Runaan_s_Hurricane_item.png",
                    description: `UNIQUE PASSIVE: Grants +20% critical strike chance and 40% attack speed <br /><br /> UNIQUE PASSIVE: Damaging an enemy shoots 3 additional bullets (${(5 * (1 / object.attackSpeed * 1.66)).toFixed(1)} seconds cooldown)`,
                    buff: function(obj)	{	
                         obj.critChance += 0.2;
          
                         // Grating the attack speed
                         obj.attackSpeed += 0.40;
                    },
                    passive: function(obj)	{

                         if (!obj.hurricaneApplied)	{
                              obj.tempBuffHurricane = new Buff(0534, "", this.img, obj, `Your next basic attack will split into 3 bullets. These bullets apply on-hit effects <br /><br />Source: ${this.name} (${obj.name})`);
                         } else	{
                              obj.tempBuffHurricane.delete();
                         }			
          
                    },
                    antibuff: function(obj)	{
                         obj.critChance -= 0.2;
                         obj.tempBuffHurricane.delete();
                         
                         // Removing the attack speed granted
                         obj.attackSpeed -= 0.40;
                    },
                    onhit: function(from, to)     {
					if (!from.hurricaneApplied)	{

						const CD = 5 * (1 / from.attackSpeed * 1.66);

						from.shoot(from.shootImage, from.y - from.h / 2);
						from.shoot(from.shootImage, from.y);
						from.shoot(from.shootImage, from.y + from.h / 2);

						setTimeout(function()	{
							from.hurricaneApplied = false;
						}, CD * 1000);

						new Ability(2786, CD, "Data/Images/Runaan_s_Hurricane_item.png", from, `${this.name} is cooling down<br /><br />Source: ${from.name}`);	// Cooldown

						from.hurricaneApplied = true;
					}
                    }
               },
               {
                    name: "Berserker's Greaves",
                    cost: 1100,
                    icon: "Data/Images/Berserker_s_Greaves_item.png",
                    description: "UNIQUE PASSIVE: Grants +35% attack speed <br /><br /> UNIQUE PASSIVE - <b>Swift</b>: grants +10 mouvement speed",
                    buff: function(obj)	{
                         obj.ms += 10;
          
                         // Grating the attack speed
                         obj.attackSpeed += 0.35;
                    },
                    antibuff: function(obj)	{
                         obj.ms -= 10;

                         obj.attackSpeed -= 0.35;
                    }
               },
               {
                    name: "Stormrazor",
                    cost: 2900,
                    icon: "Data/Images/stormrazor_item.png",
                    description: "UNIQUE PASSIVE: Grants +60 attack damage and +30% attack speed",
                    buff: function(obj)	{
                         obj.bonusAD += 60;         
         
                         // Grating the attack speed
                         obj.attackSpeed += 0.30;
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 60;
          
                         // Removing the attack speed granted
                         obj.attackSpeed -= 0.30;
                    }
               },
               {
                    name: "Youmuu's Ghostblade",
                    cost: 2700,
                    icon: "Data/Images/Youmuu_s_Ghostblade_item.png",
                    description: "UNIQUE PASSIVE: Grants +55 attack damage and +18 lithality <br /> <br /> UNIQUE PASSIVE - <b>Swift</b>: Grants +5 movement speed",
                    buff: function(obj)	{
                         obj.bonusAD += 55;
                         obj.lithality += 18;
                         obj.ms += 5;
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 55;
                         obj.lithality -= 18;
                         obj.ms -= 5;
                    }
               },
               {
                    name: "Duskblade of Draktharr",
                    cost: 2900,
                    icon: "Data/Images/Duskblade_of_Draktharr_item.png",
                    description: `UNIQUE PASSIVE: Grants +60 attack damage and +21 lithality <br /> <br />
                    UNIQUE PASSIVE - <b>Nightmare</b>: Every ${(7 * object.attackSpeed).toFixed(1)} seconds, your next basic attack will deal <orange>${floor(object.ad * 0.60) + 10}</orange> bonus physical damage`,
                    buff: function(obj)	{
                         obj.bonusAD += 60;
                         obj.lithality += 21;
          
                    },
                    passive: function(obj)	{

                         // Showing the buff indicator on HUD
                         if (!obj.duskbladeApplied)	{
                              obj.tempBuffDusk = new Buff(5782, "", this.img, obj, `This unit next basic attack will deal <orange>${10 + obj.ad * 0.60}</orange> bonus physical damage <br /><br /> Source: ${this.name} (${obj.name})`);
                         } else	{
                              obj.tempBuffDusk.delete();
                         }			
          
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 60;
                         obj.lithality -= 21;
                         obj.tempBuffDusk.delete();
                    },
                    onhit: function(from, to)     {
                         if (!from.duskbladeApplied)	{

						const CD = 7 * from.attackSpeed;

						to.damage(from, {value: 10 + (from.ad * 0.60), type: "physical", description: "Duskblade of Draktharr", allowCrit: true});

						setTimeout(function()	{
							from.duskbladeApplied = false;
						}, CD * 1000);

						// Cooldown
						new Ability(3976, CD, this.img, from, `${this.name} is cooling down <br /> <br />Source: ${from.name}`);

						from.duskbladeApplied = true;
					}
                    }
               },
               /*{
                    name: "Guinsoo's Rageblade",
                    cost: 2900,
                    icon: "Data/Images/Guinsoo_s_Rageblade_item.png",
                    description: `UNIQUE PASSIVE: Grants +25 attack damage and +25% attack speed <br />
                              UNIQUE PASSIVE - <b>growing rage</b>: Damaging an enemy grants 1 Guinsoo stack stacking infinitly. Each Guinsoo stack grants +4% attack speed and decays after 3 seconds.`,
                    buff: function(obj)	{
                         obj.bonusAD += 25;
           
                         // Grating the attack speed
                         obj.attackSpeed += 0.25;
          
                    },
                    antibuff: function(obj)	{
                         obj.bonusAD -= 25;

                         // Removing the attack speed granted
                         obj.attackSpeed -= 0.25;
                    },
                    onhit: function(from, to)     {

                         const PASSIVEAS = 4;

                         if (!from.itemsDataHolder[this.name])   {
                              from.itemsDataHolder[this.name] = { as: 0, stacks: 0 };
                         }

                         from.itemsDataHolder[this.name].as += PASSIVEAS;
                         from.itemsDataHolder[this.name].stacks += 1;
                         from.attackSpeed += PASSIVEAS;

                         // Show attackspeed stacks
                         //var y = new Buff(1564465, from.itemsDataHolder[this.name].stacks, this.img, from, `This unit has ${floor(from.itemsDataHolder[this.name].as * 100)} bonus attackspeed. <br /> <br />Source: ${this.name} (${from.name})`);
                         //y.delete();

                         new Ability(random(0, 100000, true), 3, this.img, from, `This unit has ${floor(from.itemsDataHolder[this.name].as * 100)} bonus attackspeed. <br /> <br />Source: ${this.name} (${from.name})`);

                         var x = from.itemsDataHolder[this.name];
                         var stacksRemover = setInterval(function()   {
                              if (x.stacks > 0)   {
                                   x.as -= PASSIVEAS;
                                   x.stacks -= 1;
                                   from.attackSpeed -= PASSIVEAS;  
                              } else    {
                                   clearInterval(stacksRemover);
                              }
                             
                         }, 3 * 1000);

                         from.itemsDataHolder[this.name] = x;

                    }
               },*/
               {
                    name: "Nashor's Tooth",
                    cost: 3000,
                    icon: "Data/Images/Nashor_s_Tooth_item.png",
                    description: `UNIQUE PASSIVE: Grants +80 ability power and +50% attack speed <br />
                    UNIQUE PASSIVE: Basic attacks deal 30 + <pink>(${floor(object.ap * 0.40)})</pink> bonus onhit magic damage`,
                    buff: function(obj)	{
                         obj.ap += 80;
           
                         // Grating the attack speed
                         obj.attackSpeed += 0.50;
          
                    },
                    antibuff: function(obj)	{
                         obj.ap -= 80;

                         obj.attackSpeed -= 0.50;
                    },
                    onhit: function(from, to)     {

                         to.damage(from, { value: 30 + from.ap * 0.40, type: "magic", description: this.name });

                    }
               },
               {
                    name: "Void Staff",
                    cost: 2650,
                    icon: "Data/Images/Void_Staff_item.png",
                    description: `UNIQUE PASSIVE: Grants +70 ability power<br />
                    UNIQUE PASSIVE: +40% magic penetration`,
                    buff: function(obj)	{
                         obj.ap += 70;
                         obj.magicPenPer += 0.40;
          
                    },
                    antibuff: function(obj)	{
                         obj.ap -= 70;
                         obj.magicPenPer -= 0.40;
                    }
               },
               {
                    name: "Liandry's Torment",
                    cost: 3100,
                    icon: "Data/Images/Liandry's_Torment_item.png",
                    description: `UNIQUE PASSIVE: Grants +75 ability power and +300 health<br />
                    UNIQUE PASSIVE - <b>sure death</b>: dealing damage to enemies burn them for 4.5% of their maximum health over 3 seconds increased to 9% against stunned enemies`,
                    buff: function(obj)	{
                         obj.ap += 75;
                         obj.maxHp += 300;
                         obj.hp += 300;          
                    },
                    antibuff: function(obj)	{
                         obj.ap -= 75;
                         obj.maxHp -= 300;
                         obj.hp -= 300;
                    },
                    onhit: function(from, to)     {

                         if (!to.burningFromLiandry)   {

                              var burnDamage = 0.045;
                              var duration = 3;

                              if (to.stunned)     {
                                   burnDamage *= 2;
                              }
     
                              to.DOT(from, {
                                   value: to.maxHp * burnDamage,
                                   duration: duration,
                                   allowCrit: true,
                                   type: "magic",
                                   description: this.name
                              });

                              new Ability(7864642, 3, this.img, to, `${to.name} is taking <pink>${floor(to.maxHp * burnDamage)}</pink> (${burnDamage * 100}% of its maximum health) magic damage. <br /> <br />Source: ${from.name} (${from.name})`);

                              to.burningFromLiandry = true;

                              setTimeout(function()    {
                                   to.burningFromLiandry = false;
                              }, duration * 1000);
                         }
                    }
               },
               {
                    name: "Rabadon's Deathcap",
                    cost: 3600,
                    icon: "Data/Images/Rabadon_s_Deathcap_item.png",
                    description: `UNIQUE PASSIVE: +120 ability power
                    <br /> UNIQUE PASSIVE: Grants +40% ability power (<pink>+${floor(object.lastAPAddedForDeathcap) || 0}</pink>)`,
                    buff: function(obj)	{

                         obj.ap += 120;
			
                         // Adding a slot of data to this item
                         obj.itemsDataHolder[this.name] = 0;
                         
                    },
                    passive: function(obj)	{

                         // Calculating the AP to grant
                         const GRANTAP = obj.ap * 0.40;
          
                         // Verifying this item's temp variables 
                         if (!obj.lastAPAddedForDeathcap)	{
                              obj.lastAPAddedForDeathcap = 0;
                         }
          
                         // Adding the buffs ( Calculating the amount that should be added with amountThaShouldBeAdded - LastAmountAdded. For example, if should add 12 AD and 10 AD already has been granted, it will only grand 2 AD )
                         obj.ap += (GRANTAP - obj.lastAPAddedForDeathcap);
                         
                         // Adding the amount of buffs granted to remove the same amount when the item is sold
                         obj.itemsDataHolder[this.name] = obj.lastAPAddedForDeathcap;
          
                         // Refreshing the last amount of buffs granted
                         obj.lastAPAddedForDeathcap = GRANTAP;
          
                    },
                    antibuff: function(obj)	{

                         obj.ap -= 120;

                         // Descovering the total amount of AP
                         var totalAPgranted = obj.itemsDataHolder[this.name];                         
                         delete obj.itemsDataHolder[this.name];
          
                         // Removing these amounts
                         obj.ap -= totalAPgranted;
                         
                         // Reseting temp variables
                         obj.lastAPAddedForDeathcap = 0;
          
                    }
               },
               {
                    name: "Spirit Visage",
                    cost: 2800,
                    icon: "Data/Images/Spirit_Visage_item.png",
                    description: `UNIQUE PASSIVE: +450 health, +100% health regenration and +55 magic resistance <br /><br />
                              UNIQUE PASSIVE: Amplifies all healing by 30%`,
                    buff: function(obj)	{
                         obj.maxHp += 450;
                         obj.hp += 450;
                         obj.hpRegen *= 2;
                         obj.bonusMr += 55;
                         obj.amplifyHealing = true;
                    },
                    passive: function(obj)	{
                    },
                    antibuff: function(obj)	{
                         obj.maxHp -= 450;
                         obj.hp -= 450;
                         obj.hpRegen /= 2;
                         obj.bonusMr -= 55;
                         obj.amplifyHealing = false;
                    }
               },
               {
                    name: "Wit's End",
                    cost: 2400,
                    icon: "Data/Images/Wit_s_End_item.png",
                    description: `UNIQUE PASSIVE: +50% attack speed and +50 magic resistance <br /><br />
                                   UNIQUE PASSIVE: Basic attacks deal 30 (+${15 * level}) bonus magic damage on-hit and heal for the same amount.`,
                    buff: function(obj)	{
                         obj.attackSpeed += 0.50;
                         obj.bonusMr += 50;
                    },
                    antibuff: function(obj)	{
                         obj.attackSpeed -= 0.50;
                         obj.bonusMr -= 50;
                    },
                    onhit: function(from, to)     {
                         
                         const dmg = 30 + (15 * level);
                         to.damage(from, {value: dmg, type: "magic", description: this.name});

                         from.heal(dmg);

                    }
               }
          ];

          items_list.sort(function(a, b){
			var x = a.name.toLowerCase();
			var y = b.name.toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		});

          return items_list;

     }