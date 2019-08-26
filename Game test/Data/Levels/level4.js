
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