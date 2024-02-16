require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Activity = require("../../models/Activity.js");

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
  activityToSave.owner = req.augmented.user.userid
  activityToSave = new Activity( activityToSave );
  activityToSave.activityid = activityToSave._id

  // Save
  activityToSave
    .save()
    .then(() => {
      console.log("activity.create.success");
      return res.status(201).json({
        type: "activity.create.success",
        data: {
          activityid: activityToSave.activityid,
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
          activityid: null,
        },
      });
    });
};
