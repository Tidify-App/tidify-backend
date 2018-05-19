var express = require("express")
var app = express();

module.exports = app

app.get("/", function(req, res) {

  var current_game = req.current_game;

  var user_ids = current_game.user_ids;
  var group_name = current_game.group_name;
  var activities = current_game.activities;
  var achievements = current_game.achievements;

  //initialize points_per_user to zero
  var points_per_user = [];

  for(i in user_ids) {
    var user_id = user_ids[i];
    points_per_user[user_id] = 0;
  }

  //Calculate scores for each user
  for(i in activities) {
    var current_activity = activities[i];
    var user_id = current_activity.user_id;
    var task_points = current_activity.points;

    points_per_user[user_id] += task_points;
  }

  //Look up users in database
  var db = req.db;

  db.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    var scoreboard = {};

    scoreboard.group_name = group_name;
    var users = [];

    for(var user_index in result) {
      var current_user = users[user_index];
      current_user = {};

      var user_data = result[user_index];
      current_user.name = user_data.name;
      current_user.username = user_data.username;
      current_user.current_score = points_per_user[user_data._id];
      current_user.image = "http://test.com/testimg.jpg"

      users[user_index] = current_user;
    }

    scoreboard.users = users;
    scoreboard.latest_achievements = [];

    res.send(scoreboard);
  });
});
