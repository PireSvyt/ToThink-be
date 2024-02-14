require("dotenv").config();
const User = require("../../models/User.js");
const Activity = require("../../models/Activity.js");
const Task = require("../../models/Task.js");
const Setting = require("../../models/Setting.js");

module.exports = adminGetObjectCount = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.databaseload.success
  * admin.databaseload.error.deniedaccess
  * admin.databaseload.error.oncountusers
  * admin.databaseload.error.oncountactivities
  * admin.databaseload.error.oncounttasks
  * admin.databaseload.error.oncountsettings
  
  */

  if (process.env.DEBUG) {
    console.log("admin.databaseload");
  }

  // User.count() // count without break down
  User.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]) // count with break down
    .then((users) => {
      Activity.count()
        .then((activities) => {
          // Task.count() // count without break down
          Task.aggregate([
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 }
              }
            }
          ]) // count with break down
            .then((tasks) => {
              Setting.count()
                .then((settings) => {
                  res.status(200).json({
                    type: "admin.databaseload.success",
                    data: {
                      users: users,
                      activities: activities,
                      tasks: tasks,
                      settings: settings,
                    },
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    type: "admin.databaseload.error.oncountsettings",
                    error: error,
                  });
                  console.error(error);
                });
            })
            .catch((error) => {
              res.status(400).json({
                type: "admin.databaseload.error.oncounttasks",
                error: error,
              });
              console.error(error);
            });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.databaseload.error.oncountactivities",
            error: error,
          });
          console.error(error);
        });
    })
    .catch((error) => {
      res.status(400).json({
        type: "admin.databaseload.error.oncountusers",
        error: error,
      });
      console.error(error);
    });
};