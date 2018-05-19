var express = require("express")
var app = express();

module.exports = app

app.get("/", function(req, res) {

  var users = current_game.users;
  var group_name = current_game.group_name;
  var activities = current_game.activities;
  var achievements = current_game.achievements;

  var points_per_user = [];

  //initialize points_per_user to zero
  for(i in users) {
    var user_id = users[i];
    points_per_user[user_id] = 0;
  }

  for(i in activities) {
    var current_activity = activities[i];
    var user_id = current_activity.user_id;
    var task_points = current_activity.task.points;

    points_per_user[user_id] += task_points;
  }

  //var db = req.db;
  //var users_collection = db.collection("users");
  //users_collection.

  res.send(points_per_user);
});
