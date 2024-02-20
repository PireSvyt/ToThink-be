require("dotenv").config();
const Activity = require("../../models/Activity.js");
const activityContract = require("./activity.contracts.json")

module.exports = activityGetMany = (req, res, next) => {
  /*
  
  sends back all the activities
  
  possible response types
  * activities.getmany.success
  * activities.getmany.error.notfound
  * activities.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("activities.getmany");
  }

  let match = { owner: req.augmented.user.userid }
  if (req.body.activityids !== undefined) {
    match.activityid = {
      $in: req.body.activityids
    }
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
  ])
    .sort({order: -1})
    .then((activities) => {
      if (activities !== undefined) {
        console.log("activities.getmany.success");
        let requiredActivities = {}
        activities.forEach(activity => {
          requiredActivities[activity.activityid] = {...activity}
        })
        if (req.body.requirements !== undefined) {
          Object.keys(requiredActivities).forEach(activitid => {
            req.body.requirements.forEach(requirement => {
              if (requiredActivities[activitid][requirement] === undefined) {
                switch (requirement) {
                  case 'name': 
                  case 'description': 
                    requiredActivities[activitid][requirement] = ''
                    break
                  case 'tasks': 
                    requiredActivities[activitid][requirement] = []
                    break
                }
              }
            })
          })
        }
        return res.status(200).json({
          type: "activities.getmany.success",
          data: {
            activities: requiredActivities,
          },
        });
      } else {
        console.log("activities.getmany.error.notfound");
        return res.status(101).json({
          type: "activities.getmany.error.notfound",
          data: {
            activities: {},
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
          activities: {},
        },
      });
    });
};
