require("dotenv").config();
const changeGetByItemid = require("../change/changeGetByItemid.js")

module.exports = activityGetChanges = (req, res, next) => {
  /*
  
  sends back the activity value
  
  possible response types
  * activity.getchanges.success
  * activity.getchanges.error.notfound
  * activity.getchanges.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("activity.getchanges");
  }

  changeGetByItemid(req.body.activityid)
  .then((activityChanges) => {
    if (activityChanges.type === "change.getbyitemid.success") {
      console.log("activity.getchanges.success");
      return res.status(200).json({
        type: "activity.getchanges.success",
        data: {
          changes: activityChanges.changes,
        },
      });
    } else {
      console.log("activity.getchanges.error.notfound");
      return res.status(101).json({
        type: "activity.getchanges.error.notfound",
        data: {
          changes: undefined,
        },
      });
    }
  })
  .catch((error) => {
    console.log("activity.getchanges.error.onfind");
    console.error(error);
    return res.status(400).json({
      type: "activity.getchanges.error.onfind",
      error: error,
      data: {
        changes: undefined,
      },
    });
  });
};
