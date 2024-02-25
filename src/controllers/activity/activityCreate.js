require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Activity = require("../../models/Activity.js");
const changeCreate = require("../change/changeCreate.js")
const { 
  checkCreateInputs,
  complementRequirments, 
  filterActivity 
} = require("./activity.services.js")

module.exports = activityCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * activity.create.success
  * activity.create.error.inputs
  * activity.create.error.oncreate
  * activity.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("activity.create");
  }

  let activityToSave = { ...req.body.activity }
  /*
  {
    activityid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    order: { type: Number },
  }
  */
  // Checks
  let errors = checkCreateInputs(activityToSave)
  if (errors.length > 0) {    
    return res.status(403).json({
      type: "activity.create.error.inputs",
      errors: errors
    });
  }

  // Auto fields
  activityToSave.activityid = random_string()
  activityToSave.owner = req.augmented.user.userid
  activityToSave = new Activity( activityToSave );
  activityToSave.activityid = activityToSave._id

  // Save
  activityToSave
    .save()
    .then(() => {
      console.log("activity.create.success", activityToSave);

      // Meet requirements
      let requiredActivity = complementRequirments(req.body.requirements, activityToSave)

      // Change track
      changeCreate(req, {
        itemid: activityToSave.activityid, 
        command: 'create',
        changes: {...requiredActivity}
      })

      // Filter
      let filteredActivity = filterActivity({...requiredActivity})

      // Response
      return res.status(201).json({
        type: "activity.create.success",
        data: {
          activity: filteredActivity,
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
