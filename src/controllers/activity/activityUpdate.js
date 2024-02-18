require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

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

  // Updates
  if (req.body.name !== undefined) {
    activityToSave.name = req.body.name
  }
  if (req.body.description !== undefined) {
    activityToSave.description = req.body.description
  }
  if (req.body.order !== undefined) {
    activityToSave.order = req.body.order
  }

  Activity.updateOne({ 
    activityid: activityToSave.activityid
  }, activityToSave)
    .then(() => {
      console.log("activity.update.success.modified", activityToSave);
      // Filter per contract
      let filteredActivity = {}
      Object.keys(activityToSave).forEach(key => {
        if (activityContract.activity[key] === 1) {
          filteredActivity[key] = activityToSave[key]
        }
      })
      return res.status(200).json({
        type: "activity.update.success.modified",
        data:{
          activity: filteredActivity,
        }
      });
    })
    .catch((error) => {
      console.log("activity.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "activity.update.error.onmodify",
        error: error,
        activity: null,
      });
    });
};
