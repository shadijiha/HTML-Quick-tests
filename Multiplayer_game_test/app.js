/***
*
* Main SERVER SIDE JavaScript file for "Multiplayer_game_test" project
*
*/

	const express = require('express');
	const app = express();
	const serv = require('http').Server(app);
	const mysql = require('mysql');

	// Establish connection with WAMP64
	const connection = mysql.createPool({
		connectionLimit: 50,
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'mygame'
	});
	
	// Establish route
	app.get('/', (req, res) =>	{
		res.sendFile(__dirname + '/client/index.html');
	});
	app.use('/client', express.static(__dirname + '/client'));
	
	
	serv.listen(2000);
	console.log("Server is listening to 2000");
	
	// Toggle debug mode
	const DEBUG = false;
	
	// Socket.io init
	var SOCKET_LIST = {};

	class Entity	{
		constructor(id)	{
			this.x = 250;
			this.y = 250;
			this.id = "";
			this.spdX = 0;
			this.spdY = 0;
		}
		
		update()	{
			this.updatePosition();
		}
		
		updatePosition()	{
			this.x += this.spdX;
			this.y += this.spdY;
		}

		getDistance(pt)	{
			return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
		}

	}
	
	class Bullet extends Entity	{
		constructor(parent, angle)	{
			super();
			this.id = Math.random();
			this.spdX = Math.cos(angle / 180 * Math.PI) * 10;
			this.spdY = Math.sin(angle / 180 * Math.PI) * 10;
			this.timer = 0;
			this.toRemove = false;
			this.parent = parent;
			
			Bullet.list[this.id] = this;
			
			initPack.bullet.push({
				id: this.id,
				x: this.x,
				y: this.y
			});
			
		}

		getInitPack()	{
			return {
				id: this.id,
				x: this.x,
				y: this.y
			};
		}

		getUpdatePack()	{
			return {
				id: this.id,
				x: this.x,
				y: this.y
			};			
		}
		
		update()	{
			if (this.timer++ > 100)	{
				this.toRemove = true;				
			}

			// Collision
			for (var i in Player.list)	{
				var p = Player.list[i];
				if (this.getDistance(p) < 32 && this.parent != p.id)	{
					// handle collision
					this.toRemove  = true;
				}
			}

			super.update();
		}
		
	}
	Bullet.list = {};
	Bullet.update = function()	{
		
		var pack = [];
		
		// Saving all data to one pack to send it to everybody
		for (var i in Bullet.list)	{
			var bullet = Bullet.list[i];
			bullet.update();
			
			if (bullet.toRemove)	{
				delete Bullet.list[i];
				removePack.bullet.push(bullet.id);
			} else	{
				pack.push(bullet.getUpdatePack());
			}

		}
		
		return pack;
		
	}
	
	class Player extends Entity	{
		constructor(id, name)	{
			super();
			this.id = id;
			this.name = name;
			this.number = Math.floor(10 * Math.random());
			this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
			this.pressingRight = false;
			this.pressingLeft = false;
			this.pressingUp = false;
			this.pressingDown = false;
			this.pressingAttack = false;
			this.mouseAngle = 0;
			this.maxSpd = 10;
			
			Player.list[this.id] = this;

			initPack.player.push({
				id: this.id,
				x: this.x,
				y: this.y,
				number: this.number,
				color: this.color
			});
			
		}

		getInitPack()	{
			return {
				id: this.id,
				x: this.x,
				y: this.y,
				number: this.number,
				color: this.color
			};			
		}

		getUpdatePack()	{
			return {
				id: this.id,
				x: this.x,
				y: this.y
			};			
		}
		
		update()	{
			this.updateSpd();
			super.update();			
					
			// Create random bullets
			if (this.pressingAttack)	{
				this.shootBullet(this.mouseAngle);
			}			
		}		
				
		shootBullet(angle)	{
			var b = new Bullet(this.id, angle);
			b.x = this.x;
			b.y = this.y;		
		}
		
		updateSpd()	{
			
			if (this.pressingRight)
				this.spdX = this.maxSpd;
			else if (this.pressingLeft)
				this.spdX = -this.maxSpd;
			else
				this.spdX = 0;
			
			if (this.pressingUp)
				this.spdY = -this.maxSpd;
			else if (this.pressingDown)
				this.spdY = this.maxSpd;
			else
				this.spdY = 0;
		}
	}
	Player.list = {};
	Player.onConnect = function(socket, data)	{
		
		var player = new Player(socket.id, data.username);
		
		//Input
		socket.on('keyPress', data =>	{
			if (data.inputId == 'left')
				player.pressingLeft = data.state;
			else if (data.inputId == 'right')
				player.pressingRight = data.state;
			else if (data.inputId == 'up')
				player.pressingUp = data.state;
			else if (data.inputId == 'down')
				player.pressingDown = data.state;
			else if (data.inputId == 'attack')
				player.pressingAttack = data.state;
			else if (data.inputId == 'mouseAngle')
				player.mouseAngle = data.state;
		});

		// Send init Pack
		var players = [];
		for (var i in Player.list)
			players.push(Player.list[i].getInitPack());

		var bullets = [];
		for (var i in Bullet.list)
			bullets.push(Bullet.list[i].getInitPack());

		socket.emit('init', {
			player: players,
			bullet: bullets
		});
		
	}
	Player.onDisconnect = function(socket)	{
		delete Player.list[socket.id];
		removePack.player.push(socket.id);
	}
	Player.update = function()	{
		var pack = [];
		
		// Saving all data to one pack to send it to everybody
		for (var i in Player.list)	{
			var player = Player.list[i];
			player.update();
			pack.push(player.getUpdatePack());
		}
		
		return pack;
		
	}
	
	// Handle packages
	const isValidPassword = (data, callBack) =>	{
		connection.getConnection(function(error, tempCon)	{
			if (error)	{
				tempCon.release();
				console.log("Connection error" + error);
			} else	{
				tempCon.query(`SELECT * FROM users WHERE username='${data.username}' AND password = '${data.password}'`, function(error, rows, field)	{
					tempCon.release();
					if (error)	{
						console.log("Error in the query " + error);
					} else	{
						if (rows.length > 0)	{
							callBack(true);
						} else	{
							callBack(false);
						}
					}
				});
			}
		});
	}

	const isUsernameTaken = (data, callBack) =>	{
		connection.getConnection(function(error, tempCon)	{
			if (error)	{
				tempCon.release();
				console.log("Connection error" + error);
			} else	{
				tempCon.query(`SELECT * FROM users WHERE username='${data.username}'`, function(error, rows, field)	{
					tempCon.release();
					if (error)	{
						console.log("Error in the query " + error);
					} else	{
						if (rows.length > 0)	{
							callBack(true);
						} else	{
							callBack(false);
						}
					}
				});
			}
		});		
	}

	const addUser = (data, callBack) =>	{

		connection.getConnection(function(error, tempCon)	{
			if (error)	{
				tempCon.release();
				console.log("Connection error" + error);
			} else	{
				tempCon.query(`INSERT INTO users (username, password) VALUES ('${data.username}', '${data.password}');`, function(error, rows, field)	{
					tempCon.release();
					if (error)	{
						console.log("Error in the query " + error);
					} else	{
						callBack();
					}
				});
			}
		});

	}

	const io = require('socket.io')(serv, {});
	io.sockets.on('connection', socket => {
		
		socket.id = Math.random();
		SOCKET_LIST[socket.id] = socket;
		
		// Sign in
		socket.on('signIn', data =>	{

			isValidPassword(data, result =>	{
				if (result)	{
					Player.onConnect(socket, data);
			
					// Send the connect message in the chat to everybody
					var playerName = data.username;
					for (var i in SOCKET_LIST)	{
						SOCKET_LIST[i].emit('addToChat', `<span style="color: green">${playerName} has joined</span>`);
					}
	
					socket.emit('signInResponse', {success: true});
				} else	{
					socket.emit('signInResponse', {
						success: false,
						message: 'wrong password.'
					});
				}
			});

		});

		socket.on('signUp', data =>	{

			isUsernameTaken(data, result =>	{
				if (result)	{
					socket.emit('signUpResponse', {
						success: false,
						message: `${data.username} already exists.`
					});
				} else	{

					addUser(data, () =>	{
						Player.onConnect(socket, data);
			
						// Send the connect message in the chat to everybody
						var playerName = data.username;
						for (var i in SOCKET_LIST)	{
							SOCKET_LIST[i].emit('addToChat', `<span style="color: green">${playerName} is new here, say hello!</span>`);
						}
						socket.emit('signUpResponse', {success: true});
					});					
				}

			});
						
		});	
		
		// DC
		socket.on('disconnect', () =>	{
			
			// Send the disconnect message in the chat to everybody
			var playerName = ("" + socket.id).slice(2, 7);
			if (Player.list[socket.id])	{
				playerName = Player.list[socket.id].name;
			}
			
			for (var i in SOCKET_LIST)	{
				SOCKET_LIST[i].emit('addToChat', `<span style="color: red">${playerName} has disconnected</span>`);
			}
			
			delete SOCKET_LIST[socket.id];
			Player.onDisconnect(socket);			
		});

		// Received Message a normal message from chat
		socket.on('sendMsgToServer', data =>	{

			var playerColor = "black";
			var playerName = ("" + socket.id).slice(2, 7);
			if (Player.list[socket.id])	{
				playerName = Player.list[socket.id].name;
				playerColor = Player.list[socket.id].color;
			}
			
			// Send the message to all other clients
			for (var i in SOCKET_LIST)	{
				SOCKET_LIST[i].emit('addToChat', `<span class="bold" style="color: ${playerColor};">${playerName}:</span> ${data}`);
			}

			var allLogs = "";

			// Gettins previous logs
			connection.getConnection(function(error, tempCon)	{
				if (error)	{
					tempCon.release();
					console.log("Connection error" + error);
				} else	{
					var toInsert = `${new Date().getTime()}: ${data}\n`;
					tempCon.query(`SELECT * FROM users WHERE username = '${playerName}'`, function(error, rows, field)	{
						tempCon.release();
						if (error)	{
							console.log("Error in the query " + error);
						} else	{
							allLogs = rows[0].logs;							
						}
					});
				}
			});			

			// Add the message to the user's logs
			connection.getConnection(function(error, tempCon)	{
				if (error)	{
					tempCon.release();
					console.log("Connection error" + error);
				} else	{
					var toInsert = `${new Date().getTime()}: ${data}\n`;
					tempCon.query(`UPDATE users SET logs = '${allLogs + toInsert}' WHERE username = '${playerName}'`, function(error, rows, field)	{
						tempCon.release();
						if (error)	{
							console.log("Error in the query " + error);
						}
					});
				}
			});
			
		});
		
		// Received Message from chat that starts with '/'
		socket.on('debugRequest', data =>	{
			
			if (!DEBUG)	{
				socket.emit('debugResponse', `<span style="color: red">You are not allowed to access the "${data}" command</span>`);
			} else	{	
				var response = eval(data);			
				socket.emit('debugResponse', response);
			}
			
		});
		
	});
	
	
	// Update every socket
	var initPack = { player: [], bullet: [] };
	var removePack = { player: [], bullet: [] };

	setInterval(function()	{
		var pack = {
			player: Player.update(),
			bullet: Bullet.update()
		};
		
		// Emitting to all clients
		for (var i in SOCKET_LIST)	{
			var socket = SOCKET_LIST[i];
			socket.emit('init', initPack);
			socket.emit('update', pack);
			socket.emit('remove', removePack);
		}

		initPack.player = [];
		initPack.bullet = [];
		removePack.player = [];
		removePack.bullet = [];
		
	}, 1000 / 25);
	
	