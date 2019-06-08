/*** 
 * 
 * Secondery JavaScript file for "Canvas viewpoint test" project 
 * 
 * 
 * This file contains the main GOLD and ITMES code used in this project
 *
 */
 
	/* Gold stuff */
	let gold = 0;
	let goldText = new Text(gold, 100, 100, {font: "Arial", size: 48, color: "black"});
	
	
	// Incrumenting gold and drawing it
	setInterval(() =>	{
		
		// incrumenting
		gold += 1;

		goldText.txt = gold;
	}, 500);
	
	/* Itmes stuff */
	let ownedItems = [];
	
	function buyItem(desiredItem)	{
		if (gold >= desiredItem.cost)	{
			ownedItems.push(item);
			gold -= desiredItem.cost;			
		}
	}
	
	// Appling buffs
	for (let ownedItem of ownedItems)	{
		ownedItem.applyBuff();
	}
	
	// All available items
	let msBuff = new Item(	"Mouvement Speed Buff",
							200,
							"https://t1.daumcdn.net/cfile/tistory/2370414E51F62AB708",
							"mouvementSpeed += 10"
						);
						
	let hpBuff = new Item(	"Health groth",
							150,
							"https://vignette.wikia.nocookie.net/leagueoflegends/images/8/82/Ruby_Crystal_item.png/revision/latest?cb=20171221231159",
							"player.hp += 150"
						);
						
	let allItems = [msBuff, hpBuff];