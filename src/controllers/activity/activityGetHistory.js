require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const activityContract = require("./activity.contracts.json")

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

  ToThink.findOne([
    {
      $match: { activityid: req.body.activityid },
    },
    {
      $project: { 
        _id: 0,
        activityid: 1,
        history: 1
      },
    },
  ]).then((activityHistory) => {
      if (activityHistory !== undefined) {
        console.log("activity.gethistory.success");
        return res.status(200).json({
          type: "activity.gethistory.success",
          data: {
            history: activityHistory,
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
