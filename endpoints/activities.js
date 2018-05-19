var express = require('express')
var router = express.Router()

//Used for querying by _id
var ObjectId = require('mongodb').ObjectID;

module.exports = router

// GET /
// Lists all activities for the current game
router.get('/', (req, res) => {
    
    // We have the current game from the session,
    // it is stored in req.current_game
    
    if (!req.current_game) {
        res.send("no game associated to sessionid.");
    }

    var activities = req.current_game["activities"];
    res.json({"activities": activities});
})

