/***
 * 
 * To do app
 * 
 */

const express = require('express');
const server = express();
const port = 3000;
const path = require('path');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const {app, BrowserWindow, Menu, autoUpdater, dialog} = require('electron');

// TURN ON OR OFF DEBUG MODE
const DEBUG = false;

// set up server
server.listen(port, () =>	console.log("Server is listening at " + port));	
server.use(express.static(__dirname + '/client/'));
server.use(express.json({limit: '900mb'}));

const db = new Datastore('databases/toDo.db');
db.loadDatabase();

server.get('/readDB', (request, response) =>   {

    var data;

    db.find({}, function (err, docs) {

        if (err)	{
            message = "Error! " + err;
            stat = "Error";	

            response.json({
                status: stat,
                message: message,
                results: []
            });
            
            response.end();	
            
        } else	{			
            results = docs;
            message = docs.length + " resultats";
            stat = "success";
                            
            response.json({
                status: stat,
                message: message,
                results: results
            });
            
            response.end();	
        }
    });
  
});

server.post('/addTodo', (request, response) =>	{
		
    const data = request.body;
    //data.date = new Date().getTime();
    db.insert(data);
    
    response.json({
        status: "success",
    });
    response.end();	
    
});

server.post('/deleteTodo', (request, response) =>{

    const data = request.body;
    const id = data.id;
    
    db.remove({ _id: id }, {}, function (err, numRemoved) {

        if (err)    {
            console.log("Connot delete element " + err);
        }

       db.persistence.compactDatafile();

        response.end();

    });

    //db.persistence.compactDatafile();

});


	// Set up the window for electro
	let win;

	function createWindow()	{

		win = new BrowserWindow({width: 950, height: 600, frame: true});

		/*win.loadURL(url.format({
			pathname: "http://localhost:3000",
			protocol: 'file:',
			slashes: true
		}));*/

		win.loadURL("http://localhost:3000/");

		//win.webContents.openDevTools();

		win.on('closed', () =>	{
			win = null;
		});

		var menu = Menu.buildFromTemplate([
			{
				label: 'File',
				submenu: [
					{
						label: "Refresh program",
						click()	{
							win.reload();
						}
					},
					{
						label: "Open in navigator",
						enabled: DEBUG,
						click()	{
							shell.openExternal('http://localhost:3000/');
						}
					},
					{type: "separator"},
					{
						label: 'Exit',
						click()	{
							app.quit();
						}
					}
				]
			},
			{
				label: 'View',
				submenu: [
					{
						label: "Scale",
						submenu: [
							{
								label: "Zoom in",
								enabled: DEBUG
							},
							{
								label: "Zoom out",
								enabled: DEBUG
							}
						]
					}
				]
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Open developper tool',
						enabled: DEBUG,
						click()	{
							win.webContents.openDevTools()
						}
					},
					{type: "separator"},
					{label: 'About', enabled: false}
				]
			}
		]);

		Menu.setApplicationMenu(menu);

	}

	app.on('ready', createWindow);
	app.on('window-all-closed', () =>{
		if (process.platform !== 'darwin')	{
			app.quit();
		}
	});
	app.on('activate', () =>	{
		if (win === null)	{
			createWindow();
		}
	});
	app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
		event.preventDefault();
		callback(true);
	});



