require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")
const activityGetOne = require("./activityGetOne.js")

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

  // Checks
  

  // Update
  const activityUpdate = {};
  for (const key of Object.keys(req.body)){
    activityUpdate[key] = req.body[key];
  }
  Activity.findOneAndUpdate(
    { activityid: activityToSave.activityid }, 
    { $set: activityUpdate }, 
    { new: true })
    .then(outcome => {
      console.log("activity.update.success.modified", activityUpdate);
      return res.status(200).json({
        type: "activity.update.success.modified",
        data:{
          update: activityUpdate,
          outcome: outcome,
        }
      });
    })
    .catch((error) => {
      console.log("activity.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "activity.update.error.onmodify",
        error: error,
          update: null,
      });
    });
};
