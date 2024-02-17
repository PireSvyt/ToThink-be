require("dotenv").config();
const Task = require("../../models/Task.js");
const taskContract = require("./task.contracts.json")

module.exports = taskGetMany = (req, res, next) => {
  /*
  
  sends back all the tasks
  
  possible response types
  * tasks.getmany.success
  * tasks.getmany.error.notfound
  * tasks.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tasks.getmany");
  }

  let match = { owner: req.augmented.user.userid }
  if (req.body.taskids !== undefined) {
    match.taskid = {
      $in: req.body.taskids
    }
  }

  Task.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "activities",
        foreignField: "activityid",
        localField: "activityid",
        as: "activity",
        pipeline: [
          {
            $project: taskContract.activity,
          },
        ],
      },
    },
    {
      $project: taskContract.task,
    },
  ]).then((tasks) => {
      if (tasks !== undefined) {
        console.log("task.get.success");
        return res.status(200).json({
          type: "tasks.getmany.success",
          data: {
            tasks: tasks,
          },
        });
      } else {
        console.log("task.get.error.notfound");
        return res.status(101).json({
          type: "tasks.getmany.error.notfound",
          data: {
            tasks: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("tasks.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "tasks.getmany.error.onfind",
        error: error,
        data: {
          tasks: [],
        },
      });
    });
};
