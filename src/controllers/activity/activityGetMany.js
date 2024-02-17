require("dotenv").config();
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

module.exports = activityGetMany = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activities.getmany.success
  
  */

  if (process.env.DEBUG) {
    console.log("activities.getmany");
  }

  let match = { owner: req.augmented.user.userid }
  if (req.body.activityids !== undefined) {
    match.activityid = req.body.activityids
  }

  Activity.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "tasks",
        foreignField: "activityid",
        localField: "activityid",
        as: "tasks",
        pipeline: [
          {
            $project: activityContract.tasks,
          },
        ],
      },
    },
    {
      $project: activityContract.activity,
    },
  ]).then((activities) => {
      if (activities !== undefined) {
        console.log("activities.getmany.success");
        return res.status(200).json({
          type: "activities.getmany.success",
          data: {
            activities: activities,
          },
        });
      } else {
        console.log("activities.getmany.error.notfound");
        return res.status(101).json({
          type: "activities.getmany.error.notfound",
          data: {
            activities: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("activities.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activities.getmany.error.onfind",
        error: error,
        data: {
          activities: [],
        },
      });
    });
};
