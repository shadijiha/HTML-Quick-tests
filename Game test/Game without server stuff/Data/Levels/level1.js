/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file builds LEVEL 1
 * 
 *
 */

	function loadLevel1()	{

		monsters = [];
		loots = [];
		platformes = [];


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
			myMonster.attackSpeed = 3;
			myMonster.gold = 10000;
			myMonster.profile = "Data/Images/monster.png";
			myMonster.bulletSpeed = -3;
			myMonster.name = `Monster ${counter}`;
			counter++;

			buyItem(myMonster, allItmes[random(0, allItmes.length, true)]);

			applyBuffsToAllItems(myMonster);
			worldElements.push(myMonster);
		}

		// Moved to levels_main_function.js
		/*for (let monster of monsters)	{
			setInterval(function()	{			
				if (!paused && player.hp > 0)	{
					monster.shoot(monster.shootImage);
				}
				new Ability(1050, canvas.height * 0.82 - 52, monster.attackSpeed, "Data/Images/Long_Staff_item.png", monster);
			}, monster.attackSpeed * 1000);
		}*/

		// Platformes
		new Platforme(200, 500, 500);
		new Platforme(800, 400, 300);
		new Platforme(1200, 250, 300);
		new Platforme(1700, 250, 500);
		new Platforme(1700, 450, 500);

		// Tree
		/*new Decoration("Data/Images/tree0.png", 200, 220, 300, 300).draw();
		new Decoration("Data/Images/tree2.png", 1100, world.level - 330, 300, 300).draw();
		new Decoration("Data/Images/tree1.png", 1400, world.level - 330, 300, 300).draw();*/

		// Buffs
		new Loot("Data/Images/hp_potion.png", 450, 450, `Heal for <green> 10% </green> of you maximum health`).buff = () =>	{
			player.hp += (player.maxHp * 0.10);
		};
		new Loot("Data/Images/goldx2.png", 850, 350, "Doubles your current gold").buff = () =>	{
			player.gold *= 2;
		};
		new Loot("Data/Images/hp_potion.png", 1300, 200, `Heal for <green> 20% </green> of you maximum health`).buff = () =>	{
			player.hp += (player.maxHp * 0.20);
		};
		new Loot("Data/Images/gift.png", 1000, world.level - 100, `Get a random free item`).buff = () =>	{			
			const RANDOMITEM = allItmes[random(0, allItmes.length, true)];
			player.gold += RANDOMITEM.cost;
			buyItem(player, RANDOMITEM);
		};

	}
	

	
 
 