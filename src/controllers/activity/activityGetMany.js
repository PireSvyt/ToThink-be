require("dotenv").config();
const Activity = require("../../models/Activity.js");

module.exports = activityGetMany = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activities.getmany.success
  
  */

  if (process.env.DEBUG) {
    console.log("activities.getmany");
  }

  Activity.aggregate([
    {
      $match: { userid: req.augmented.user.userid },
    },
    {
      $lookup: {
        from: "tasks",
        foreignField: "activityid",
        localField: "activityid",
        as: "tasks",
        pipeline: [
          {
            $project: {
              _id: 0,
              taskid: 1,
              name: 1,
              state: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        activityid: 1,
        name: 1,
        description: 1,
        tasks: 1,
      },
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
