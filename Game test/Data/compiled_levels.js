/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file builds LEVEL 1
 * 
 *
 */

	function loadLevel1()	{

		// Give player 1 random item
		const itemToPlayer = allItmes[random(0, allItmes.length, true)];
		player.gold += itemToPlayer.cost;
		buyItem(player, itemToPlayer);

		monsters = [];
		loots = [];
		platformes = [];
		decorations = [];

		new Decoration('data/Images/sun.png', 200, 100, 150, 150); 
		new Decoration('data/Images/cloud.png', 800, -50, 1000, 500); 

		let monster0 = new Player(600, 0);
		let monster1 = new Player(1000, 0);
		let monster2 = new Player(900, world.level - 150);
		let monster3 = new Player(1400, 0);
		let monster4 = new Player(2100, 0);
		let monster5 = new Player(2100, 400);
		let monster6 = new Player(2100, world.level - 150);

		let counter = 0;

		monsters = [...monsters, monster0, monster1, monster2, monster3, monster4, monster5, monster6];

		for (let myMonster of monsters)	{
			
			myMonster.shootImage = "bullet";
			myMonster.gold = 10000;
			myMonster.attackSpeed = 0.33;
			myMonster.profile = "Data/Images/monster.png";
			myMonster.bulletSpeed = -3;
			myMonster.name = `Monster ${counter}`;
			counter++;

			buyItem(myMonster, allItmes[random(0, allItmes.length, true)]);

			applyBuffsToAllItems(myMonster);
			worldElements.push(myMonster);
		}

		// Platformes
		new Platforme(300, 500, 500);
		new Platforme(800, 400, 300);
		new Platforme(1200, 250, 300);
		new Platforme(1700, 250, 500);
		new Platforme(1700, 450, 500);

		// Buffs
		new Loot("Data/Images/hp_potion.png", 450, 450, `Heal for <green> 10% </green> of you maximum health`).buff = () =>	{
			player.heal(player.maxHp * 0.10);
		};
		new Loot("Data/Images/goldx2.png", 850, 350, "Doubles your current gold").buff = () =>	{
			player.gold *= 2;
		};
		new Loot("Data/Images/hp_potion.png", 1300, 200, `Heal for <green> 20% </green> of you maximum health`).buff = () =>	{
			player.heal(player.maxHp * 0.20);
		};
		new Loot("Data/Images/gift.png", 1000, world.level - 100, `Get a random free item`).buff = () =>	{			
			const RANDOMITEM = allItmes[random(0, allItmes.length, true)];
			player.gold += RANDOMITEM.cost;
			buyItem(player, RANDOMITEM);
		};

	}
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
/*** 
* 
* JavaScript file for "Game test" project 
* 
* This JavaScript file builds LEVEL 3
* 
*
*/
					 
	function loadLevel3()	{

		worldElements = [ground, castle];				 
		monsters = [];
		loots = [];
		platformes = []; 
		decorations = [];
 
		new Decoration('data/Images/sun.png', 602, 41, 150, 150); 
		new Decoration('data/Images/cloud.png', 795, 47, 500, 150); 
		new Decoration('data/Images/cloud.png', 50, 34, 500, 150); 
		new Platforme(832, 514, 300); 
		var monster0 = new Player(1031.5, 377); 
 		monster0.shootImage = "bullet";
 		monster0.profile = "Data/Images/monster.png"; 
 		monster0.bulletSpeed = -3 
		monster0.name = 'Monster 0';
		monsters.push(monster0); 
		monster0.gold += 850; 
		buyItem(monster0, allItmes[16]); 
		monster0.gold += 2900; 
		buyItem(monster0, allItmes[2]); 
		monster0.gold += 2900; 
		buyItem(monster0, allItmes[20]); 

		new Platforme(637, 388, 200); 
		var monster1 = new Player(737.5, 249); 
 		monster1.shootImage = "bullet";
 		monster1.profile = "Data/Images/monster.png"; 
		monster1.bulletSpeed = -3 ;
		monster1.attackSpeed = 0.33; 
		monster1.name = 'Monster 1';
		monsters.push(monster1); 
		monster1.gold += 3400; 
		buyItem(monster1, allItmes[6]); 
		monster1.gold += 3500; 
		buyItem(monster1, allItmes[17]); 
		monster1.gold += 2700; 
		buyItem(monster1, allItmes[4]); 

		new Platforme(1171, 394, 200); 
		var monster2 = new Player(1281.5, 255); 
 		monster2.shootImage = "bullet";
 		monster2.profile = "Data/Images/monster.png"; 
		monster2.bulletSpeed = -3;
		monster2.attackSpeed = 0.33; 
		monster2.name = 'Monster 2';
		monsters.push(monster2); 
		monster2.gold += 2900; 
		buyItem(monster2, allItmes[14]); 
		monster2.gold += 2600; 
		buyItem(monster2, allItmes[11]); 
		monster2.gold += 2800; 
		buyItem(monster2, allItmes[7]); 

		var monster3 = new Player(1276.5, 509); 
 		monster3.shootImage = "bullet";
 		monster3.profile = "Data/Images/monster.png"; 
		monster3.bulletSpeed = -3;
		monster3.attackSpeed = 0.33; 
		monster3.name = 'Monster 3';		
		monsters.push(monster3); 
		monster3.gold += 2850; 
		buyItem(monster3, allItmes[21]); 
		monster3.gold += 2900; 
		buyItem(monster3, allItmes[20]); 
		monster3.gold += 2600; 
		buyItem(monster3, allItmes[19]); 
		monster3.gold += 2900; 
		buyItem(monster3, allItmes[15]); 

		var monster4 = new Player(1948.5, 518); 
 		monster4.shootImage = "bullet";
 		monster4.profile = "Data/Images/monster.png"; 
 		monster4.bulletSpeed = -3;
		monster4.attackSpeed = 0.33; 
		monster4.name = 'Monster 4';
		monsters.push(monster4); 
		monster4.gold += 2600; 
		buyItem(monster4, allItmes[11]); 
		monster4.gold += 2600; 
		buyItem(monster4, allItmes[12]); 
		monster4.gold += 2800; 
		buyItem(monster4, allItmes[10]); 

		var monster5 = new Player(2332.5, 311); 
 		monster5.shootImage = "bullet";
 		monster5.profile = "Data/Images/monster.png"; 
 		monster5.bulletSpeed = -3;
		monster5.attackSpeed = 0.33; 
		monster5.name = 'Monster 5';
		monsters.push(monster5); 
		monster5.gold += 1995; 
		buyItem(monster5, allItmes[18]); 
		monster5.gold += 2700; 
		buyItem(monster5, allItmes[5]); 
		monster5.gold += 1100; 
		buyItem(monster5, allItmes[0]); 

		new Platforme(2213, 458, 200); 
		new Platforme(2213, 458, 200); 
		new Decoration('data/Images/cloud.png', 2069, 67, 500, 150); 

		for (let myMonster of monsters)	{			
			applyBuffsToAllItems(myMonster);
			
			for (let i = 0; i < level; i++)	{
				myMonster.levelUp();
			}

			worldElements.push(myMonster);
		}

	}
/*** 
* 
* JavaScript file for "Game test" project 
* 
* This JavaScript file builds LEVEL 4
* 
*
*/
					 
	function loadLevel4()	{

		worldElements = [ground, castle];					 
		monsters = [];
		loots = [];
		platformes = []; 
		decorations = [];
 
		var monster0 = new Player(992.5, 399); 
 		monster0.shootImage = "bullet";
 		monster0.profile = "Data/Images/monster.png"; 
 		monster0.bulletSpeed = -3;
		monster0.attackSpeed = 0.33;
		monster0.name = 'Monster 0';
		monsters.push(monster0); 

		new Platforme(875, 534, 200); 
		new Platforme(745, 380, 100); 
		new Platforme(884, 278, 100); 
		new Loot('Data/Images/gift.png', 918, 229, 30, 30).buff = function()	{
		const ran = allItmes[random(0, allItmes.length, true)];
player.gold += ran.cost;
buyItem(player, ran);
		}; 
		new Decoration('data/Images/sun.png', 518, 4, 150, 150); 
		new Decoration('data/Images/cloud.png', -35, 6, 500, 150); 
		new Decoration('data/Images/cloud.png', 757, 3, 500, 150); 
		new Loot('Data/Images/goldx2.png', 781, 330, 30, 30).buff = function()	{
		player.gold += 200
		}; 

		for (let myMonster of monsters)	{			
			applyBuffsToAllItems(myMonster);

			for (let i = 0; i < level; i++)	{
				myMonster.levelUp();
			}

			worldElements.push(myMonster);
		}
	}