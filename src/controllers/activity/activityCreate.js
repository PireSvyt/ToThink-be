require("dotenv").config();
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
  let activityToSave = { ...req.body };
  activityToSave.userid = req.augmented.user.userid
  activityToSave = new Activity(activityToSave);
  console.log("activityToSave", activityToSave.toObject())

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
