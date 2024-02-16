require("dotenv").config();
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

module.exports = activityDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * activity.delete.success
  * activity.delete.error.ondeletetasks
  * activity.delete.error.ondeleteactivity
  
  */

  if (process.env.DEBUG) {
    console.log("activity.delete");
  }

  Activity.deleteOne({ activityid: req.body.activityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("activity.delete.success");
        return res.status(200).json({
          type: "activity.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("activity.delete.error.outcome");
        return res.status(400).json({
          type: "activity.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("activity.delete.error.ondeleteactivity");
      console.error(error);
      return res.status(400).json({
        type: "activity.delete.error.ondeleteactivity",
        error: error,
      });
    });
};
