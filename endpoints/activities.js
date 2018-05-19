var express = require('express')
var router = express.Router()

//Used for querying by _id
var ObjectId = require('mongodb').ObjectID;

module.exports = router

// GET /
// Returns array of all users
router.get('/', (req, res) => {
    res.send("test");
    //var db = req.db;
    //var collection = db.collection('game');
    //var query = {};
    //collection.find(query).toArray(function(err, result) {
    //    if (err) throw err;
    //    res.send(result);
    //});
})

