require("dotenv").config();
const Activity = require("../../models/Activity.js");
const changeCreate = require("../change/changeCreate.js")
const complementRequirments = require("./activity.services.js")

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
      //console.log("from:", activityUpdate);
      //console.log("to  :", newActivityState);
      
      // Outcome
      let updatedActivity = {}
      for (const key of Object.keys(req.body)){
        updatedActivity[key] = newActivityState[key];
      }

      // Change track
      changeCreate(req, {
        itemid: updatedActivity.activityid, 
        command: 'update',
        changes: {...updatedActivity}
      })

      // Meet requirements
      let requiredActivity = {}
      if (req.body.requirements !== undefined) {
        requiredActivity = complementRequirments(req.body.requirements, updatedActivity)
        //console.log("requiredActivity", requiredActivity)
      } else {
        requiredActivity = updatedActivity
      }

      // Response
      return res.status(200).json({
        type: "activity.update.success.modified",
        data:{
          update: requiredActivity,
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
