/*** 
 * 
 * Main JavaScript file for "Canvas viewpoint test" project 
 * 
 * This JavaScript file works on World visualization
 * 
 *
 */
	
	//createCanvas(window.innerWidth, window.innerHeight, {background: "#add8e6"});
	
	canvas = document.querySelector("canvas");
	c = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	
	resized = function()    {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	
	// World
	let world = {
		width: 5000,
		height: canvas.height
	};
	
	// Setting Environement
	let levelY = 500;
	let ground = new Rectangle(-1000, levelY, world.width, canvas.height, {fill: "green", stroke: "green"});
	let sun = new Circle(300, 100, 50, {fill: "yellow", stroke: "orange"});
	let cloud1 = new Cloud(570, 80);
	let testRect = new Circle(2000, levelY - 30, 30, {fill: "orange"});
	
	let worldElements = [ground, sun, cloud1, testRect];
	
	// Setting gameplay
	let player = new Player(100, levelY - 100);

	
	let mouvementSpeed = 10;
	
	window.onkeydown = function(event)	{
		switch(event.keyCode)	{
			case 68:
				moveWorld(-mouvementSpeed);
				break;
			case 65:
				moveWorld(mouvementSpeed);
				break;
		}
	}
		
	
	// Moving world
	function moveWorld(amountX)	{
		
		// Moving ground
		for (let ele of worldElements)	{

			// Moving the world in X while ensuring the the player won't go too far to the left (using the sun as refrence)
			if (sun.x <= canvas.width / 2)	{
				ele.x += amountX;
			} else	{
				sun.x = canvas.width / 2;
			}


		}
		
	}
	
	
	
	
	
	
	
