var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("tidifydb");

    await dbo.collection("users").drop(function(err, delOK) {
        //if (err) throw err;
        if (delOK) console.log("Users deleted");
        
        dbo.createCollection("users", function(err, res) {
            if (err) throw err;
            console.log("Users collection created!");
        });

    });

    await dbo.collection("games").drop(function(err, delOK) {
        //if (err) throw err;
        if (delOK) console.log("Games deleted");
        
        dbo.createCollection("games", function(err, res) {
            if (err) throw err;
            console.log("Collection Games created!");
            
            db.close();
        });
    });
});
