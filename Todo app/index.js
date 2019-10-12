/***
 * 
 * To do app
 * 
 */

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const Datastore = require('nedb');
const fetch = require('node-fetch');

app.listen(port, () =>	console.log("Server is listening at " + port));	
app.use(express.static(__dirname + '/'));
app.use(express.json({limit: '900mb'}));

const db = new Datastore('toDo.db');
db.loadDatabase();

app.get('/readDB', (request, response) =>   {

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

app.post('/addTodo', (request, response) =>	{
		
    const data = request.body;
    //data.date = new Date().getTime();
    db.insert(data);
    
    response.json({
        status: "success",
    });
    response.end();	
    
});

app.post('/deleteTodo', (request, response) =>{

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



