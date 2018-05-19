// Script clear and setups up inital database structure and state,
// such as dummy users and an active game.


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("tidifydb");

    // USERS
    {
        // Define demo dummy data
        demodata_users = [
            {
                "name": "Test User 1",
                "username": "user1",
                "email": "test1@example.com",
            },
            {
                "name": "Test User 2",
                "username": "user2",
                "email": "test2@example.com",
            },
        ];

        await dbo.collection("users").insert(demodata_users, function(err, result) {
            console.log('Dummy Users data inserted');
        });
    }

    // Games
    {

        var users = await dbo.collection("users").find({}).toArray();

        demodata_games = [
            {
                "user_ids": [
                    users[0]["_id"],
                    users[1]["_id"],
                ],
                "group_name" : "El Casa Diablos",
                "activities": [
                    {
                        //"_id": ##,
                        "name": "Dishes",
                        "codename": "dishes",
                        "user_id": users[0]["_id"],
                        "points": 10,
                        "imageurl": "/taskimages/:dishes"
                    },
                    {
                        //"_id": ##,
                        "name": "Vacuuming",
                        "codename": "vacuum",
                        "user_id": users[0]["_id"],
                        "points": 15,
                        "imageurl": "/taskimages/:vacuum"
                        },{
                        //"_id": ##,
                        "name": "Vacuuming",
                        "codename": "vacuum",
                        "user_id": users[1]["_id"],
                        "points": 15,
                        "imageurl": "/taskimages/:vacuum"
                    }
                ],

                "achievements": [
                    {
                        //"_id": #,
                        "title": "Dishwasher Pro",
                        //"user_id": #objectId,
                        "user_id": users[0]["_id"],
                        "timestamp": "2018-05-14 18:08:04",
                        "image": "/taskimages/:dishpro"
                    },
                    {
                        //"_id": #,
                        "title": "Third time's the charm",
                        //"user_id": #objectId,
                        "user_id": users[1]["_id"],
                        "timestamp": "2018-05-15 18:08:04",
                        "image": "/taskimages/:charming"
                    }
                ]
            }
        ];

        await dbo.collection("games").insert(demodata_games, function(err, result) {
            console.log('Dummy Game data inserted');
        });
    }

    await db.close();
});
