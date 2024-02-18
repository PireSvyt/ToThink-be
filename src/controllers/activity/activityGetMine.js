require("dotenv").config();
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

module.exports = activityGetMine = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activities.getmine.success
  
  */

  if (process.env.DEBUG) {
    console.log("activities.getmine");
  }

  let match = { owner: req.augmented.user.userid }

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
      $project: activityContract.mine,
    },
  ])
    .sort({order: -1})
    .then((activities) => {
      if (activities !== undefined) {
        console.log("activities.getmine.success");
        /*// Reset order
        let orders = activities.map(a => {return a.order})
        let min = Math.min(orders)
        let max = Math.max(orders)
        let c = 1
        let K = 100
        let activitiesReordered = activities.map(a => {
          let act = {...a}
          if (max !== min) {
            act.order = (a.order - min) / (max - min) * K + 1
          } else {
            act.order = (c / orders.length) * K + 1
            c += 1
          }
          return act
        })*/
        return res.status(200).json({
          type: "activities.getmine.success",
          data: {
            activities: activities,
          },
        });
      } else {
        console.log("activities.getmine.error.notfound");
        return res.status(101).json({
          type: "activities.getmine.error.notfound",
          data: {
            activities: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("activities.getmine.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activities.getmine.error.onfind",
        error: error,
        data: {
          activities: [],
        },
      });
    });
};
