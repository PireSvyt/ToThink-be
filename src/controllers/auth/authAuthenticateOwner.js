require("dotenv").config();
const User = require("../../models/User.js");
const Task = require("../../models/Task.js");
const Activity = require("../../models/Activity.js");

module.exports = authAuthenticateOwner = (req, res, next) => {
  /*
  
  authenticate the user as the owner
  
  possible response types
  * auth.authenticateowner.error.collectionmistmatch
  * auth.authenticateowner.error.notfound
  * auth.authenticateowner.error.onfind
  * auth.authenticateowner.error.isnotowner
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticateowner");
  }

  return new Promise((resolve, reject) => {

    let collection = undefined;
    let match = {};
    let item = undefined;

    if (req.body.taskid !== undefined) {
      collection = Task;
      item = "task"
      match['owner'] = {
        $in: [ req.augmented.user.userid ],
      };
      match['taskid'] = {
        $in: [ req.body.taskid ],
      };
    } else {
      if (req.body.activityid !== undefined) {
        collection = Activity;
        item = "activity"
        match['owner'] = {
          $in: [ req.augmented.user.userid ],
        };
        match['activityid'] = {
          $in: [ req.body.activityid ],
        };
      } else {        
        console.log("auth.authenticateowner.error.collectionmistmatch");
        return res.status(404).json({
          type: "auth.authenticateowner.error.collectionmistmatch"
        });
      }
    }

    if (collection !== undefined) {
      collection
        .find(match)
        .then((itemList) => {
          if (itemList.length === 1) {
            if (process.env.DEBUG === true) {
              console.log("auth.authenticateowner.success");
            }
            req.augmented[item] = itemList[0]
            next();
          } else {
            return res.status(404).json({
              type: "auth.authenticateowner.error.notfound",
            });
          }
        })
        .catch((error) => {
          console.log("auth.authenticateowner.error.onfind");
          console.error(error);
          return res.status(500).json({
            type: "auth.authenticateowner.error.onfind",
          });
        });
    }
  })  
};
