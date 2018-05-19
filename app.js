const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const WebSocket = require('ws');

const dbhost = "mongodb://localhost:27017/";
var db;

MongoClient.connect(dbhost, function(err, database) {
    if (err) throw err;
    db = database.db('mydb');
    console.log("Database connected!");
});

const wss = new WebSocket.Server({port: 3001});

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

var users = require('./users');
app.use('/users', users);

app.get('/', (req, res) => {
    var collection = db.collection('users');
    res.send({msg: "Index test!"})
} )

app.listen(3000, () => console.log('Example app listening on port 3000!'))
