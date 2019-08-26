/***  
 * JavaScript main file for "Game test" project 
 * 
 * 
 */
 
 
	createCanvas(window.innerWidth, window.innerHeight, {background: "#add8e6"}); 
	
			
	/**********************************************
	****************** World **********************
	**********************************************/
	let worldElements = [];
	
	let world = {
		width: 5000,
		height: canvas.height,
		level: 700
	};
		
	let ground = new Image("Data/Images/grass.png", -200, world.level - 150, world.width, canvas.height - world.level + 150, "ground");
	let sun = new Image("Data/Images/sun.png", 200, 100, 150, 150, "sun");
	let clouds = [
		new Image("Data/Images/cloud.png", 800, -50, 1000, 500, "cloud")
	];
	
	// All elements in the worlds in this array 
	for (let cloud of clouds)	{
		worldElements.push(cloud);
	}
	
	worldElements = [...worldElements, ground, sun,];
	
	/**********************************************
	***************** Player **********************
	**********************************************/
	let player = new Player(100, world.level - 150);
	let monsters = [];
	let rangeFromEnemy = 10000000;
	
	
	// Player mouvement
	function moveWorld(amount)	{
		for (let worldElement of worldElements)	{
			worldElement.x += amount;
		}
	}
	
	/**********************************************
	****************** Pausing ********************
	**********************************************/
	let paused = false;
	let pauseButton = new Image("Data/Images/pauseButton.png", 0, 0, 75, 75, "pause_button");
	