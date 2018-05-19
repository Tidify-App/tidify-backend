const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const bodyParser = require('body-parser')
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

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse various different custom JSON types as JSON
//app.use(bodyParser.json({ type: 'application/*+json' }))

// make our db and wss accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    req.wss = wss;

    // Hardcoded for DEMO
    // Get current Game
    db.collection("games").findOne({}, function(err, result) {
        if (err) throw err;
        req.current_game = result;

        // Get current user
        db.collection("users").find({}).toArray( function(err, result) {
            if (err) throw err;
            var sessionid = req.query.sessionid;
            switch(sessionid) {
                case "1":
                    req.current_user = result[0];
                    break;
                case "2":
                    req.current_user = result[1];
                    break;
                default:
                    req.current_user = undefined;
                    break;
            }
            next();
        });
    });

});

// Start mounting endpoints
//

var ep_activities = require('./endpoints/activities');
var ep_scoreboard = require('./endpoints/scoreboard');
var ep_achievements = require('./endpoints/achievements');

app.use('/activities', ep_activities);
app.use('/scoreboard', ep_scoreboard);
app.use('/achievements', ep_achievements);

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
