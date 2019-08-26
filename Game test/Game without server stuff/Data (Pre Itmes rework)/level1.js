/*** 
 * 
 * JavaScript file for "Game test" project 
 * 
 * This JavaScript file builds LEVEL 1
 * 
 *
 */
 

	let myMonster = new Player(canvas.width - 200, world.level - 150);
	myMonster.gold = 1000000;
	myMonster.profile = "Data/Images/monster.png";	
	buyItem(myMonster, allItmes[1]);
	buyItem(myMonster, allItmes[0]);
	buyItem(myMonster, allItmes[8]);
	worldElements.push(myMonster);
	
	monsters.push(myMonster);

	
	setInterval(function()	{
		if (!paused)	{
			myMonster.shoot("bullet");
		}
	}, 3000);
	
	
	function drawLevel()	{
	
		for (let monster of monsters)	{
			new Image(monster.profile, monster.x, monster.y, monster.w, monster.h, "myMonsterImage").draw();
			monster.showHpBar(monster.x, monster.y - 20, monster.w, 20);
			
					
			// Draw bullets
			for (let bullet of monster.shootArray)	{
				
				bullet.draw();
				bullet.x -= 3;
				
				if (collision(player, bullet))	{
					player.damage(monster);
					monster.shootArray.splice(bullet, 1);
				}			
			}

			
			// Putting monster HUD
			if (monster.clicked())	{
				lastClickedHudShow = monster;
			} else	{
				lastClickedHudShow = player;
			}
			
			// Finding the nearest monster
			let d = Math.abs(distance(player.x, player.y, monster.x, monster.y));
			if (d < rangeFromEnemy)	{
				rangeFromEnemy = d;
			}
		}	
	}
	
 
 