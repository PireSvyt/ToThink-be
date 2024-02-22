require("dotenv").config();
const Activity = require("../../models/Activity.js");
const random_id = require("../../resources/random_id.js")

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
  let history = [...req.augmented.activity.history]
  // Checks
  

  // Update
  const activityUpdate = {};
  for (const key of Object.keys(req.body)){
    activityUpdate[key] = req.body[key];
  }
  history.push({
    date: new Date(),
    command: 'update',
    change: {...activityUpdate} 
  })
  if (activityUpdate.history === undefined) {
    activityUpdate.history = []
  }
  activityUpdate.history = history
  Activity.findOneAndUpdate(
    { activityid: req.body.activityid }, 
    { $set: activityUpdate },
    { new: true })
    .then(newActivityState => {
      console.log("activity.update.success.modified");
      console.log("from:", activityUpdate);
      console.log("to  :", newActivityState);
      let updatedActivity = {}
      for (const key of Object.keys(req.body)){
        updatedActivity[key] = newActivityState[key];
      }
      return res.status(200).json({
        type: "activity.update.success.modified",
        data:{
          update: updatedActivity,
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
