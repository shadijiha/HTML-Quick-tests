/***
 * 
 *   Server-side main file for "Game test"
 * 
 */

     const express = require('express');
     const app = express();
     const serv = require('http').Server(app);
	const mysql = require('mysql');
	const mergeFiles = require('merge-files');
	const fs = require('fs');

	// Merge all level files
	async function compileLevels()	{
		const outputPath = __dirname + '/Data/compiled_levels.js';

		var inputPathList = fs.readdirSync(__dirname + '/Data/Levels/');
		
		for (let i = 0; i < inputPathList.length; i++)	{
			inputPathList[i] = __dirname + '/Data/Levels/' + inputPathList[i];
		}

		const status = await mergeFiles(inputPathList, outputPath);
	}
	compileLevels();

     // Establish connection with WAMP64
	const connection = mysql.createPool({
		connectionLimit: 50,
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'shadodatabase'
	});

     // Establish route
	app.get('/', (req, res) =>	{
		res.sendFile(__dirname + '/Game test.html');
	});
	app.use('/', express.static(__dirname + '/'));
	
	
	serv.listen(4000);
     console.log("Server is listening to 4000");

     // Player stuff
     class Player {
		constructor(id, name)	{
			this.id = id;
			this.name = name;
			this.number = Math.floor(10 * Math.random());
			this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
			
			Player.list[this.id] = this;			
		}
	}
     Player.list = {};
	Player.onConnect = function(socket, data)	{

		var player = new Player(socket.id, data.username);
		
	}
	Player.onDisconnect = function(socket)	{
		delete Player.list[socket.id];
	}

     // Handle packages
	const isValidPassword = (data, callBack) =>	{
		connection.getConnection(function(error, tempCon)	{
			if (error)	{
				tempCon.release();
				console.log("Connection error" + error);
			} else	{
				tempCon.query(`SELECT * FROM shadotable WHERE username='${data.username}' AND password = '${data.password}'`, function(error, rows, field)	{
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
				tempCon.query(`SELECT * FROM shadotable WHERE username='${data.username}'`, function(error, rows, field)	{
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
				tempCon.query(`INSERT INTO shadotable (username, password) VALUES ('${data.username}', '${data.password}');`, function(error, rows, field)	{
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

     var SOCKET_LIST = {};
     
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

		/*socket.on('signUp', data =>	{

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
						
		});*/
		
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
				var cssClass = "enemy";
				if (i == socket.id)	{
					cssClass = "ally";
				}

				SOCKET_LIST[i].emit('addToChat', `<span class="${cssClass}">[All] ${playerName} (Player):</span> ${data}`);
				
			}

			var allLogs = "";

			// Gettins previous logs
			/*connection.getConnection(function(error, tempCon)	{
				if (error)	{
					tempCon.release();
					console.log("Connection error" + error);
				} else	{
					var toInsert = `${new Date().getTime()}: ${data}\n`;
					tempCon.query(`SELECT * FROM shadotable WHERE username = '${playerName}'`, function(error, rows, field)	{
						tempCon.release();
						if (error)	{
							console.log("Error in the query " + error);
						} else	{
							allLogs = rows[0].logs;							
						}
					});
				}
			});	*/		

			// Add the message to the user's logs
			/*connection.getConnection(function(error, tempCon)	{
				if (error)	{
					tempCon.release();
					console.log("Connection error" + error);
				} else	{
					var toInsert = `${new Date().getTime()}: ${data}\n`;
					tempCon.query(`UPDATE shadotable SET logs = '${allLogs + toInsert}' WHERE username = '${playerName}'`, function(error, rows, field)	{
						tempCon.release();
						if (error)	{
							console.log("Error in the query " + error);
						}
					});
				}
			});*/
			
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
	
