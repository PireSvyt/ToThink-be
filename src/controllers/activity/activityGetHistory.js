require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const changeGetByItemid = require("../change/changeGetByItemid.js")

module.exports = activityGetHistory = (req, res, next) => {
  /*
  
  sends back the activity value
  
  possible response types
  * activity.gethistory.success
  * activity.gethistory.error.notfound
  * activity.gethistory.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("activity.gethistory");
  }

  changeGetByItemid(req.body.activityid)
  .then((activityChanges) => {
    if (activityChanges.type === "change.getbyitemid.success") {
      console.log("activity.gethistory.success");
      return res.status(200).json({
        type: "activity.gethistory.success",
        data: {
          history: activityChanges.changes,
        },
      });
    } else {
      console.log("activity.gethistory.error.notfound");
      return res.status(101).json({
        type: "activity.gethistory.error.notfound",
        data: {
          history: undefined,
        },
      });
    }
  })
  .catch((error) => {
    console.log("activity.gethistory.error.onfind");
    console.error(error);
    return res.status(400).json({
      type: "activity.gethistory.error.onfind",
      error: error,
      data: {
        history: undefined,
      },
    });
  });
};
