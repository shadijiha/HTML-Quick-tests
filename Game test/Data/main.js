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
		width: scaleW(5200),
		height: canvas.height,
		level: scaleH(700),
		virtualPosition: 0
	};
		
	let ground = new Image("Data/Images/grass.png", -700, world.level - 150, world.width, canvas.height - world.level + 150, "ground");
	let castle = new Image("Data/Images/end.png", world.width - 1150, world.level - 400, 400, 400, "castle");

	let platformes = [];
	let loots = [];
	let decorations = [];
	let allItmes = [];
	let allWindows = [];
	let tempRenderer = [];
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
		showHitBox: false,
		itemShopLayout: "uncompressed"
	};
	
	worldElements = [ground, castle];
	
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
	let totalMovedAmount = 0;
	
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
		}
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
			//document.getElementById("chat").style.display = "block";
			//document.getElementById("chat").innerHTML += `<br /> ${text}`;

			socket.emit('sendMsgToServer', text);

			pingMode = false;

			//hideChat();
		}

	}

	function hideChat()	{
		if (document.getElementById('chat').style.display != "none")	{
			setTimeout(function()	{
				if (document.activeElement != document.getElementById('chatInput'))	{
					document.getElementById('chat').style.display = 'none';
					document.getElementById('chatInput').style.display = 'none';
				}
			}, 10000);
		}
	}

	function monsterSendChat(monster, text)	{
		//document.getElementById("chat").innerHTML += `<br /><span class="enemy">[All] ${monster.name} (Monster):</span> ${filter(text)}`;

		socket.emit('sendMsgToServer',  `${monster.name} (Monster): ${text}`);
	}

	window.onload = function()	{
		document.getElementById("chat_form").addEventListener("submit", function(e)	{

			var chatInput = document.getElementById("chatInput");
			e.preventDefault();
			
			if (chatInput.value[0] == '/')	{
				//socket.emit('debugRequest', chatInput.value.slice(1));	// Debugg chat

				// Client side debugg
				try	{
					var response = eval(chatInput.value.slice(1));
					document.getElementById("chat").innerHTML += `<div><green>Success!</green> ${chatInput.value.slice(1)} = ${response}</div>`;
				} catch(err)	{
					document.getElementById("chat").innerHTML += `<div><red>Error!</red>${err}</div>`;
				}
				
			} else	{
				socket.emit('sendMsgToServer', chatInput.value);		// Normal chat
			}
			
			chatInput.value = '';		
		});
	}

	socket.on('addToChat', data =>	{
		if (document.getElementById("chat"))	{
			var chatText = document.getElementById("chat");
			chatText.innerHTML += '<div> ' + filter(data) + ' </div>';	
			chatText.style.display = "block";
			chatText.scrollTop = chatText.scrollHeight;
			hideChat();
			//parseChat();	
		}

	});
	
	socket.on('debugResponse', data =>	{
		var chatText = document.getElementById("chat");

		chatText.innerHTML += '<div>' + JSON.stringify(data) + '</div>';
		console.log(data);
	});


	
	/**********************************************
	****************** Pausing ********************
	**********************************************/
	let paused = false;
	let pauseButton = new Image("Data/Images/pauseButton.png", 0, 0, 75, 75, "pause_button");

	function pauseGame()	{
		if (!paused)	{
			pauseButton.src = "Data/Images/playButton.png";
			paused = true;
			setTimeout(stopAnimation, 100);
		} else	{
			paused = false;
			pauseButton.src = "Data/Images/pauseButton.png";
			resumeAnimation();
		}
	}

	pauseGame();

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
	function scaleH(number)	{
		return number / (1080 * 0.922) * canvas.height;
	}

	function scaleW(number)	{
		return number / 1920 * canvas.width;
	}

	function percentWidth(per)	{
		return canvas.width * (per / 100);
	}

	function percentHeight(per)	{
		return canvas.height * (per / 100);
	}

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

	function filter(string)	{

		var str = string;
		// Filter insults
		str = str.replace(/fuck/, "****");
		str = str.replace(/shit/, "****");
		str = str.replace(/\bass\b/, "***");
		str = str.replace(/nigger/, "******");

		// Twitch emotes
		str = str.replace("Kappa", `<img title="Kappa" src="Data/Images/Emotes/Kappa.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("4Head", `<img title="4Head" src="Data/Images/Emotes/4Head.png" class="emote" width="28px" height="35px" />`);
		str = str.replace("TriHard", `<img title="TriHard" src="Data/Images/Emotes/TriHard.png" class="emote" width="28px" height="32px" />`);
		str = str.replace("LULW", `<img title="LULW" src="Data/Images/Emotes/LULW.png" class="emote" width="28px" height="32px" />`);
		str = str.replace("OMEGALUL", `<img title="OMEGALUL" src="Data/Images/Emotes/OMEGALUL.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("tyler1Hey", `<img title="tyler1Hey" src="Data/Images/Emotes/tyler1Hey.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("PogU", `<img title="PogU" src="Data/Images/Emotes/PogU.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("PepeHands", `<img title="PepeHands" src="Data/Images/Emotes/PepeHands.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("FeelsBadMan", `<img title="FeelsBadMan" src="Data/Images/Emotes/FeelsBadMan.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("EZ", `<img title="EZ" src="Data/Images/Emotes/EZ.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("Clap", `<img title="Clap" src="Data/Images/Emotes/Clap.gif" class="emote" width="34px" height="34px" />`);
		str = str.replace("Pepega", `<img title="Pepega" src="Data/Images/Emotes/Pepega.png" class="emote" width="32px" height="32px" />`);
		str = str.replace("POGGERS", `<img title="POGGERS" src="Data/Images/Emotes/POGGERS.png" class="emote" width="32px" height="32px" />`);
		str = str.replace(":)", `<img title=":)" src="Data/Images/Emotes/smile.png" class="emote" width="28px" height="22px" />`);
		str = str.replace(":/", `<img title=":/" src="Data/Images/Emotes/slash.png" class="emote" width="28px" height="22px" />`);
		str = str.replace(":D", `<img title=":D" src="Data/Images/Emotes/D.png" class="emote" width="28px" height="22px" />`);
		str = str.replace(":P", `<img title=":P" src="Data/Images/Emotes/P.png" class="emote" width="28px" height="22px" />`);

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
