const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const WebSocket = require('ws');

// Connect to Database
const dbhost = "mongodb://localhost:27017/";
var db;
MongoClient.connect(dbhost, function(err, database) {
    if (err) throw err;
    db = database.db('tidifydb');
    console.log("Database connected!");
});

// Start websocket server.
const wss = new WebSocket.Server({port: 3001});

// Define a broadcast function.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

var app = express()

// make our db and wss accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    req.wss = wss;
    next();
});



// Start mounting endpoints
//

var ep_activities = require('./endpoints/activities');
app.use('/activities', ep_activities);

app.get('/helloworld', (req, res) => {
    res.send({msg: "Hello World!"})
} )

app.listen(3000, () => console.log('Example app listening on port 3000!'))
