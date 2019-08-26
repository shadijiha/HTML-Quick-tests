/***
 * 
 * Main SERVER side javascript file for "Upload_code_website" project
 * 
*/

     const express = require('express');
     const fetch = require('node-fetch');
     const io = require('socket.io');
     const app = express();

     // Server setup
     app.listen(3000, () => console.log("Server has started listening to port 3000"));
     app.use(express.static('public'));