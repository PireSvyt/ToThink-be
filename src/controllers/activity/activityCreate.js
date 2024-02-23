require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")
const changeCreate = require("../change/changeCreate.js")
const complementRequirments = require("./activity.services.js")

module.exports = activityCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * activity.create.success
  * activity.create.error.oncreate
  * activity.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("activity.create");
  }

  // Save
  let activityToSave = { ...req.body }
  activityToSave.activityid = random_string()
  activityToSave.owner = req.augmented.user.userid
  activityToSave = new Activity( activityToSave );
  activityToSave.activityid = activityToSave._id

  // Save
  activityToSave
    .save()
    .then(() => {
      console.log("activity.create.success", activityToSave);

      // Filter
      let filteredActivity = {}
      Object.keys(activityToSave._doc).forEach(key => {
        if (activityContract.activity[key] === 1) {
          filteredActivity[key] = activityToSave._doc[key]
        }
      })

      // Change track
      changeCreate(req, {
        itemid: activityToSave.activityid, 
        command: 'create',
        changes: {...filteredActivity}
      })

      // Meet requirements
      let requiredActivity = {}
      if (req.body.requirements !== undefined) {
        requiredActivity = complementRequirments(req.body.requirements, filteredActivity)
        //console.log("requiredActivity", requiredActivity)
      } else {
        requiredActivity = filteredActivity
      }
      
      // Response
      return res.status(201).json({
        type: "activity.create.success",
        data: {
          activity: requiredActivity,
        },
      });
    })
    .catch((error) => {
      console.log("activity.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "activity.create.error.oncreate",
        error: error,
        data: {
          activity: null,
        },
      });
    });
};
