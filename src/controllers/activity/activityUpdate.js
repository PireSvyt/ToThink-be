require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Activity = require("../../models/Activity.js");

module.exports = activityUpdate = (req, res, next) => {
  /*
  
  saves a activity
  
  possible response types
  * activity.update.error.activityid
  * activity.update.success.modified
  * activity.update.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("activity.update");
  }

  let activityToSave = { ...req.augmented.activity };

  // Save
  Activity.updateOne({ 
    activityid: activityToSave.activityid,
    userid: req.augmented.user.userid
  }, activityToSave)
    .then(() => {
      console.log("activity.update.success.modified");
      return res.status(200).json({
        type: "activity.update.success.modified",
      });
    })
    .catch((error) => {
      console.log("activity.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "activity.update.error.onmodify",
        error: error,
      });
    });
};
