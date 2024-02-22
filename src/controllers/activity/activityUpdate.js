require("dotenv").config();
const Activity = require("../../models/Activity.js");
const changeCreate = require("../change/changeCreate.js")

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
      changeCreate(req, {
        itemid: activityUpdate.activityid, 
        command: 'update',
        changes: {...activityUpdate}
      })
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
