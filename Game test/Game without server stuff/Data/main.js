/***  
 * JavaScript main file for "Game test" project 
 * 
 * 
 */
 
 
	createCanvas(window.innerWidth, window.innerHeight, {background: "#add8e6"});

	// Putting array insert method
	Array.prototype.insert = function(index, item)	{
		this.splice( index, 0, item );
	};
	
			
	/**********************************************
	****************** World **********************
	**********************************************/

	let TIME1 = performance.now();	// This DOUBLE variable is used to calculate the game FPS

	let worldElements = [];
	
	let world = {
		width: 5700,
		height: canvas.height,
		level: 700,
		virtualPosition: 0
	};
		
	let ground = new Image("Data/Images/grass.png", -700, world.level - 150, world.width, canvas.height - world.level + 150, "ground");
	let sun = new Image("Data/Images/sun.png", 200, 100, 150, 150, "sun");
	let castle = new Image("Data/Images/end.png", world.width - 1150, world.level - 400, 400, 400, "castle");
	let clouds = [
		new Image("Data/Images/cloud.png", 800, -50, 1000, 500, "cloud")
	];

	let platformes = [];
	let loots = [];
	let decorations = [];
	let allItmes = [];
	let allWindows = [];
	let settings = {
		showMonsterHpBar: true,
		showMonsterEnergyBar: true,
		showMonsterRange: false,
		monsterRangeColor: "orange",
		monsterRangeOpacity: 0.05,
		showPlayerHpBar: false,
		showPlayerEnergyBar: false,
		showPlayerRange: false,
		playerRangeColor: "purple",
		playerRangeOpacity: 0.05,
		showFullHUD: true,
		showFPS: true,
		showMiniMap: true,
		playCritSound: true,
		critSoundVolume: 0.1,
		extendedStats: "C",
		pingKey: "G",
		pingKey2: "V",
		showHitBox: false
	};

	// All elements in the worlds in this array 
	for (let cloud of clouds)	{
		worldElements.push(cloud);
	}
	
	worldElements = [...worldElements, ground, sun, castle];
	
	/**********************************************
	***************** Player **********************
	**********************************************/
	let player = new Player(canvas.width / 3, world.level - 150);	// This OBJECT variable stores all main player data
	let monsters = [];												// This OBJECT array stores all the monster objects for the current level
	let rangeFromEnemy = [];										// This OBJECT array stores {object: monster (player) object, distance: distance between player and monster}
	let monsterskilled = 0;											// This INT variable stores all the number of monsters killed
	let deadUnits = [];												// This OBJECT array stores all dead units
	let gameOver = false;											// This BOOLEAN stores if the game has ended or not (player.hp <= 0)
	//let level = 1;	THIS VERIABLE HAS BEEN MOVED TO "classes.js"// This INT variable tracks the current level
	let time = 0;
	let replay = [];
	let totalMovedAmount = 0;
	let replayMode = false;
	
	// Player mouvement
	function moveWorld(amount)	{
		if (!gameOver)	{
			for (let worldElement of worldElements)	{
				worldElement.x += amount;

				// For bullets to stay in range from where they were shot
				if (worldElement.bulletStartX)	{
					worldElement.bulletStartX += amount;
				}

			}
			
			world.virtualPosition -= amount;
			player.initialX -= amount;
			totalMovedAmount -= amount;

			// Record replay
			replay.push({
				action:`moveWorld(${amount})`,
				timeStamp: time
			});
		}
	}

	// To replay
	function replayLevel()	{

		replayMode = true;
		
	}


	// To hide and show HTML elements
	function hideElements(array)	{
		for (let element of array)	{
			element.style.display = "none";
		}
	}

	function showElements(array)	{
		for (let element of array)	{
			element.style.display = "";
		}		
	}

	// To ping an object in the chat
	function pingInChat(object, text)	{

		if (pingMode && object.clicked())	{
			document.getElementById("chat").style.display = "block";
			document.getElementById("chat").innerHTML += `<br /> ${text}`;
			pingMode = false;

			hideChat();
		}

	}

	function hideChat()	{
		if (document.getElementById('chat').style.display != "none")	{
			setTimeout(function()	{
				document.getElementById('chat').style.display = 'none'; document.getElementById('chatInput').style.display = 'none';
			}, 4000);
		}
	}


	
	/**********************************************
	****************** Pausing ********************
	**********************************************/
	let paused = false;
	let pauseButton = new Image("Data/Images/pauseButton.png", 0, 0, 75, 75, "pause_button");

	/**********************************************
	***************** Settings ********************
	**********************************************/
	let settingsButton = new Image("Data/Images/settings.png", 80, 0, 75, 75, "settings_button");

	function changeSetting(variable)	{
		if (eval(variable))	{
			eval(variable + " = false");
		} else	{
			eval(variable + " = true");
		}
	}

	function showRange(object, color, opacity)	{
		c.globalAlpha = opacity;
		new Circle(object.x + object.w / 2, object.y + object.h / 2, object.range, {fill: color, stroke: color, lineWidth: 3}).draw();
		c.globalAlpha = 1;
	}

	/* Detecting the canvas average framerate (for ability speed) */
	let FPS = 0;			// Current canvas framerate
	let CANVASFPS = 120;	// Stores canvas average framerate (Default 120)
	let allFps = [];		// First 500 framecounts to calculate average framerate

	function detectFramerate()	{

		let sum = 0;
		
		for (let i = 0; i < allFps.length; i++)	{
			sum += allFps[i];
		}

		return Math.round(sum / allFps.length);

	}

	/**********************************************
	**************** Other stuff ******************
	**********************************************/
	function showDescription(text, positions)	{

		if (positions == undefined)	{
			positions = {
				x: undefined, 
				y: undefined
			};
		}

		if (positions.x == undefined)	{
			positions.x = mouse.x;
		}

		if (positions.y == undefined)	{
			positions.y = mouse.y - 100;
		}

		const MAIN = document.getElementById("description");
		MAIN.innerHTML = text;
		MAIN.style.left = `${positions.x}px`;
		MAIN.style.top = `${positions.y}px`;
		MAIN.style.display = "block";
	}

	function hideDescription()	{
		document.getElementById("description").style.display = "none";
	}

	function replce(string, what, replaceWith)	{
		let tempString = string.split(" ");

		for (let i = 0; i < tempString.length; i++)	{
			if (tempString[i] == what)	{
				tempString[i] = replaceWith;
			}
		}

		tempString = tempString.join(" ");

		return tempString;
	}

	function deleteFromArray(array, obj)	{
		for (let i = 0; i < array.length; i++)	{
			if (array[i] == obj)	{
				array.splice(i, 1);
			}
		}
	}

	function assignDefault(variable, defaultValue)	{

		if (variable == false || variable == true)	{
			return variable;
		}

		if (variable == undefined || variable == "" || variable == null)	{
			return defaultValue;
		} else	{
			return variable;
		}

	}

	function keepBelowValue(value, maxValue)	{

		if (value > maxValue)	{
			return maxValue;
		} else	{
			return value;
		}

	}

	function keepAboveValue(value, minValue)	{

		if (value < minValue)	{
			return minValue;
		} else	{
			return value;
		}

	}

	function filter(str)	{

		// Filter insults
		str = substract(str, "fuck");
		str = substract(str, "shit");
		str = substract(str, "ass");
		str = substract(str, "nigger");

		// Twitch emotes
		str = replce(str, "Kappa", `<img title="Kappa" src="Data/Images/Emotes/Kappa.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "4Head", `<img title="4Head" src="Data/Images/Emotes/4Head.png" class="emote" width="28px" height="35px" />`);
		str = replce(str, "TriHard", `<img title="TriHard" src="Data/Images/Emotes/TriHard.png" class="emote" width="28px" height="32px" />`);
		str = replce(str, "LULW", `<img title="LULW" src="Data/Images/Emotes/LULW.png" class="emote" width="28px" height="32px" />`);
		str = replce(str, "OMEGALUL", `<img title="OMEGALUL" src="Data/Images/Emotes/OMEGALUL.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "tyler1Hey", `<img title="tyler1Hey" src="Data/Images/Emotes/tyler1Hey.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "PogU", `<img title="PogU" src="Data/Images/Emotes/PogU.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "PepeHands", `<img title="PepeHands" src="Data/Images/Emotes/PepeHands.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "FeelsBadMan", `<img title="FeelsBadMan" src="Data/Images/Emotes/FeelsBadMan.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "EZ", `<img title="EZ" src="Data/Images/Emotes/EZ.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "Clap", `<img title="Clap" src="Data/Images/Emotes/Clap.gif" class="emote" width="34px" height="34px" />`);
		str = replce(str, "Pepega", `<img title="Pepega" src="Data/Images/Emotes/Pepega.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, "POGGERS", `<img title="POGGERS" src="Data/Images/Emotes/POGGERS.png" class="emote" width="32px" height="32px" />`);
		str = replce(str, ":)", `<img title=":)" src="Data/Images/Emotes/smile.png" class="emote" width="28px" height="22px" />`);
		str = replce(str, ":/", `<img title=":/" src="Data/Images/Emotes/slash.png" class="emote" width="28px" height="22px" />`);
		str = replce(str, ":D", `<img title=":D" src="Data/Images/Emotes/D.png" class="emote" width="28px" height="22px" />`);
		str = replce(str, ":P", `<img title=":P" src="Data/Images/Emotes/P.png" class="emote" width="28px" height="22px" />`);

		return str;

	}

	function substract(string, word)	{

		let temp = string.split("");
		
		string = string.toLowerCase();

		if (string.includes(word))	{

			let splitWord = word.split("");

			for (let i = string.indexOf(splitWord[0]); i <= string.lastIndexOf(splitWord[splitWord.length - 1]); i++)	{
				temp[i] = "*";
			}

		}

		return temp.join("");
	}

	function monsterSendChat(monster, text)	{
		document.getElementById("chat").innerHTML += `<br /><span class="enemy">[All] ${monster.name} (Monster):</span> ${filter(text)}`;
	}

	function chat(text)	{
		document.getElementById("chat").innerHTML += filter(text);
	}