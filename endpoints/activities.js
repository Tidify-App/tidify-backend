var express = require('express')
var router = express.Router()

//Used for querying by _id
var ObjectId = require('mongodb').ObjectID;

module.exports = router

// GET /
// Lists all activities for the current game
router.get('/', (req, res) => {
    
    console.log(req);
    // We have the current game from the session,
    // it is stored in req.current_game
    
    if (!req.current_game) {
        res.send("no game associated to sessionid.");
        return false;
    }

    var activities = req.current_game["activities"];
    res.json({"activities": activities});
})

// POST /
// Make a new activity to the current game,
// current game is determined by the sessionid.
router.post('/', (req, res) => {
    // We have the current game from the session,
    // it is stored in req.current_game
    
    /*
    req.body.activity = {}
    req.body.activity.task = {}
    req.body.activity.user_id = 1;
    req.body.activity.task.name = "Test task";
    req.body.activity.task.codename = "testtask";
    req.body.activity.task.points = 10;
    */
    
    if (!req.current_game) {
        res.send({success: false});
        return false;
    }

    new_data = { $addToSet: {
        activities: {
            name: req.body.activity.task.name,
            codename: req.body.activity.task.codename,
            user_id: req.current_user["_id"],//req.body.activity.user_id,
            points: req.body.activity.task.points,
        }
    } };

    var collection_id = new ObjectId(req.current_game["_id"]);
    req.db.collection("games").updateOne({"_id": collection_id}, new_data,
        function(err, result) {
            if (err) throw err;
            console.log("Added new activity to game!")

            // We have a new activity! 
            // Broadcast this to clients over websocket.
            {
                var ws_new_activity_notice = {
                    "event": "new_activity",
                    "data": {
                        "user": req.current_user,
                        "task_codename": req.body.activity.task.codename,
                        "points": req.body.activity.task.points
                    }
                }
                req.wss.broadcast(JSON.stringify(ws_new_activity_notice));
            }

            res.send({success: true});
    });

})

