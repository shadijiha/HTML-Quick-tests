
/*** 
* 
* JavaScript file for "Game test" project 
* 
* This JavaScript file builds LEVEL 2
* 
*
*/
					 
	function loadLevel2()	{
		
		worldElements = [ground, castle];
		monsters = [];
		loots = [];
		platformes = [];
		decorations = [];
 
		new Platforme(830, 492, 400); 
		new Platforme(1285, 363, 450); 
		new Decoration('data/Images/sun.png', 715, 49, 150, 150); 
		new Decoration('data/Images/cloud.png', 907, 49, 500, 150); 
		new Decoration('data/Images/cloud.png', 1687, 44, 500, 200); 
		var monster0 = new Player(1522.5, 218);
 		monster0.shootImage = "bullet";
		monster0.attackSpeed = 0.33;
 		monster0.profile = "Data/Images/monster.png";
 		monster0.bulletSpeed = -3;
		monster0.name = 'Monster 0';
		monsters.push(monster0);
		monster0.gold += 3400; 
		buyItem(monster0, allItmes[7]); 
		monster0.gold += 3000; 
		buyItem(monster0, allItmes[3]); 
		monster0.gold += 2800; 
		buyItem(monster0, allItmes[14]); 

		var monster1 = new Player(1128.5, 354);
 		monster1.shootImage = "bullet";
		monster1.attackSpeed = 0.33;
 		monster1.profile = "Data/Images/monster.png";
 		monster1.bulletSpeed = -3;
		monster1.name = 'Monster 1';
		monsters.push(monster1);
		monster1.gold += 2400; 
		buyItem(monster1, allItmes[28]); 
		monster1.gold += 2600; 
		buyItem(monster1, allItmes[17]); 
		monster1.gold += 2600; 
		buyItem(monster1, allItmes[15]); 

		new Loot('Data/Images/hp_potion.png', 1652, 298, 30, 30).buff = function()	{
		player.heal(player.maxHp * 0.25);
		}; 
		var monster2 = new Player(1730.5, 497);
 		monster2.shootImage = "bullet";
		monster2.attackSpeed = 0.33;
 		monster2.profile = "Data/Images/monster.png";
 		monster2.bulletSpeed = -3;
		monster2.name = 'Monster 2';
		monsters.push(monster2);
		monster2.gold += 2850; 
		buyItem(monster2, allItmes[27]); 
		monster2.gold += 2900; 
		buyItem(monster2, allItmes[25]); 
		monster2.gold += 2800; 
		buyItem(monster2, allItmes[16]); 

		new Loot('Data/Images/gift.png', 730, 598, 30, 30).buff = function()	{
			player.hp = player.maxHp;
			const randI = allItmes[random(0, allItmes.length, true)];
			player.gold += randI.cost;
			buyItem(player, randI);
		}; 
		new Platforme(2025, 468, 500); 
		var monster3 = new Player(2428.5, 314);
 		monster3.shootImage = "bullet";
		monster3.attackSpeed = 0.33;
 		monster3.profile = "Data/Images/monster.png";
 		monster3.bulletSpeed = -3;
		monster3.name = 'Monster 3';
		monsters.push(monster3);
		monster3.gold += 2900; 
		buyItem(monster3, allItmes[25]); 
		monster3.gold += 2850; 
		buyItem(monster3, allItmes[27]); 
		monster3.gold += 2900; 
		buyItem(monster3, allItmes[20]); 

		var monster4 = new Player(2524.5, 495);
 		monster4.shootImage = "bullet";
		monster4.attackSpeed = 0.33;
 		monster4.profile = "Data/Images/monster.png";
 		monster4.bulletSpeed = -3;
		monster4.name = 'Monster 4';
		monsters.push(monster4);
		monster4.gold += 3000; 
		buyItem(monster4, allItmes[11]); 
		monster4.gold += 3600; 
		buyItem(monster4, allItmes[13]); 
		monster4.gold += 2600; 
		buyItem(monster4, allItmes[17]); 


		for (let myMonster of monsters)	{			
			applyBuffsToAllItems(myMonster);
			
			for (let i = 0; i < level; i++)	{
				myMonster.levelUp();
			}
			
			worldElements.push(myMonster);
		}
	}