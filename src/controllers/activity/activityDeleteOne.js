require("dotenv").config();
const Activity = require("../../models/Activity.js");
const changeCreate = require("../change/changeCreate.js")

module.exports = activityDeleteOne = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * activity.deleteone.success
  * activity.deleteone.error.ondeletetothinks
  * activity.deleteone.error.ondeleteactivity
  
  */

  if (process.env.DEBUG) {
    console.log("activity.deleteone");
  }

  Activity.deleteOne({ activityid: req.body.activityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("activity.deleteone.success");
        changeCreate(req, {
          itemid: req.body.activityid, 
          command: 'delete'
        })
        return res.status(200).json({
          type: "activity.deleteone.success",
          data: {
            outcome: deleteOutcome,
            activityid: req.augmented.activity.activityid
          }
        });
      } else {
        console.log("activity.deleteone.error.outcome");
        return res.status(400).json({
          type: "activity.deleteone.error.outcome",
          data: {
            outcome: deleteOutcome,
          }
        });
      }
    })
    .catch((error) => {
      console.log("activity.deleteone.error.ondeleteactivity");
      console.error(error);
      return res.status(400).json({
        type: "activity.deleteone.error.ondeleteactivity",
        error: error,
      });
    });
};
