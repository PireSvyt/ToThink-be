require("dotenv").config();
const Activity = require("../../models/Activity.js");
const { 
  getActivityContractForActivity, 
  getActivityContractForToThink, 
  complementRequirments 
} = require("./activity.services.js")

module.exports = activityGetMany = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activity.getmany.success
  * activity.getmany.error.notfound
  * activity.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("activity.getmany");
  }

  let match = { owner: req.augmented.user.userid }
  if (req.body.activityids !== undefined) {
    if (req.body.activityids.length !== 0) {
      match.activityid = {
        $in: req.body.activityids
      }
    }
  }

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
            $project: getActivityContractForToThink(),
          },
        ],
      },
    },
    {
      $project: getActivityContractForActivity(),
    },
  ])
    .sort({order: -1})
    .then((activities) => {
      if (activities !== undefined) {
        console.log("activity.getmany.success");

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
        
        // Response
        return res.status(200).json({
          type: "activity.getmany.success",
          data: {
            activities: filteredActivities,
          },
        });
      } else {
        console.log("activity.getmany.error.notfound");
        return res.status(101).json({
          type: "activity.getmany.error.notfound",
          data: {
            activities: {},
          },
        });
      }
    })
    .catch((error) => {
      console.log("activity.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "activity.getmany.error.onfind",
        error: error,
        data: {
          activities: {},
        },
      });
    });
};
