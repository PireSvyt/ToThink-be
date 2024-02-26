require("dotenv").config();
const Activity = require("../../models/Activity.js");
const {  
  activityContractForMine,
  activityContractForToThink,
  complementRequirments,
  filterActivity
} = require("./activity.services.js")

module.exports = activityGetMine = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activity.getmine.success
  
  */

  if (process.env.DEBUG) {
    console.log("activity.getmine");
  }

  let match = { owner: req.augmented.user.userid }

  Activity.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "tothinks",
        foreignField: "activityid",
        localField: "activityid",
        as: "tothinks",
        pipeline: [
          {
            $project: activityContractForToThink,
          },
        ],
      },
    },
    {
      $project: activityContractForMine,
    },
  ])
    .sort({order: -1})
    .then((activities) => {
      if (activities !== undefined) {
        console.log("activity.getmine.success");

        // Meet requirements
        let requiredActivities = {}
        activities.forEach(activity => {
          requiredActivities[activity.activityid] = complementRequirments(req.body.requirements, activity)         
        })

        // Filter
        let filteredActivities = {}
        activities.forEach(activity => {
          filteredActivities[activity.activityid] = filterActivity({...requiredActivities[activity.activityid]})
        })

        return res.status(200).json({
          type: "activity.getmine.success",
          data: {
            activities: filteredActivities,
          },
        });
      } else {
        console.log("activity.getmine.error.notfound");
        return res.status(101).json({
          type: "activity.getmine.error.notfound",
          data: {
            activities: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("activity.getmine.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activity.getmine.error.onfind",
        error: error,
        data: {
          activities: [],
        },
      });
    });
};
