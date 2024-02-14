require("dotenv").config();
const Activity = require("../../models/Activity.js");

module.exports = activityGetOne = (req, res, next) => {
  /*
  
  sends back the activity value
  
  possible response types
  * activity.get.success
  * activity.get.error.notfound
  * activity.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("activity.getone");
  }

  Activity.findOne({ activityid: req.body.activityid })
    .then((activity) => {
      if (activity !== undefined) {
        console.log("activity.get.success");
        return res.status(200).json({
          type: "activity.get.success",
          data: {
            activity: activity,
          },
        });
      } else {
        console.log("activity.get.error.undefined");
        return res.status(101).json({
          type: "activity.get.error.undefined",
          data: {
            activity: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("activity.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activity.get.error.onfind",
        error: error,
        data: {
          activity: undefined,
        },
      });
    });
};
