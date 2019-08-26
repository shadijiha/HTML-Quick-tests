/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file builds LEVEL 1
 * 
 *
 */

	function loadLevel2()	{

		worldElements = [ground, castle];
		monsters = [];
		loots = [];
		platformes = [];
		decorations = [];

		new Decoration('data/Images/sun.png', 200, 100, 150, 150); 
		new Decoration('data/Images/cloud.png', 800, -50, 1000, 500); 

		for (let i = 1; i <= 4; i++)	{
			let myMonster = new Player(500 * i, world.level - 150);
			myMonster.gold = 15000;
			myMonster.profile = "Data/Images/monster.png";
			myMonster.shootImage = "bullet";
			myMonster.attackSpeed = 0.33;
			myMonster.bulletSpeed = -3;
			myMonster.name = `Monster ${i}`;
			buyItem(myMonster, allItmes[random(0, allItmes.length, true)]);
			buyItem(myMonster, allItmes[random(0, allItmes.length, true)]);
			applyBuffsToAllItems(myMonster);
			worldElements.push(myMonster);
			
			monsters.push(myMonster);
		}

		for (let monster of monsters)	{
			var counter = 0;
			while(counter < level)	{
				monster.levelUp();
				counter++;
			}
		}


		// Moved to levels_main_function.js
		/*for (let monster of monsters)	{
			setInterval(function()	{			
					if (!paused)	{
						monster.shoot(monster.shootImage);
					}
			}, monster.attackSpeed * 1000);
		}*/
	}
	
 
 