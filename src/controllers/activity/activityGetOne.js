require("dotenv").config();
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

module.exports = activityGetOne = (req, res, next) => {
  /*
  
  sends back the activity value
  
  possible response types
  * activity.getone.success
  * activity.getone.error.notfound
  * activity.getone.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("activity.getone");
  }
  
  Activity.aggregate([
    {
      $match: { activityid: req.body.activityid },
    },
    {
      $lookup: {
        from: "tothinks",
        foreignField: "activityid",
        localField: "activityid",
        as: "tothinks",
        pipeline: [
          {
            $project: activityContract.tothinks,
          },
          {
            $sort: { order: -1 }
          }
        ],
      },
    },
    {
      $project: activityContract.activity,
    },
  ]).then((activity) => {
      if (activity !== undefined) {
        console.log("activity.getone.success");
        return res.status(200).json({
          type: "activity.getone.success",
          data: {
            activity: activity[0],
          },
        });
      } else {
        console.log("activity.getone.error.undefined");
        return res.status(101).json({
          type: "activity.getone.error.undefined",
          data: {
            activity: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("activity.getone.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activity.getone.error.onfind",
        error: error,
        data: {
          activity: undefined,
        },
      });
    });
};
