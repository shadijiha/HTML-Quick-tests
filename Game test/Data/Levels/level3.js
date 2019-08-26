
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