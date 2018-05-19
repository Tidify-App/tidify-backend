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

    // identify session
    var sessionid = req.query.sessionid;

    // Hardcoded sessions for DEMO
    switch(sessionid) {
        case "1":
            req.current_user = {
                "name": "Test User 1",
            };
            break;
        case "2":
            req.current_user = {
                "name": "Test User 2",
            };
            break;
        default: 
            req.current_user = undefined;
            break;
    }
    
    // Get current Game
    db.collection("games").findOne({}, function(err, result) {
        if (err) throw err;
        //console.log(result);
        req.current_game = result;
        next();
    })

});



// Start mounting endpoints
//

var ep_activities = require('./endpoints/activities');
app.use('/activities', ep_activities);

app.get('/helloworld', (req, res) => {
    res.send({msg: "Hello World!"})
} )

app.get('/listgames', (req, res) => {
    db.collection("games").find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    })
} )

app.listen(3000, () => console.log('Example app listening on port 3000!'))
