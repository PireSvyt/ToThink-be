require("dotenv").config();
const Task = require("../../models/Task.js");
const taskContract = require("./task.contracts.json")

module.exports = taskGetMany = (req, res, next) => {
  /*
  
  sends back all the tasks
  
  possible response types
  * task.getmany.success
  * task.getmany.error.notfound
  * task.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("task.getmany");
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
        console.log("task.getmany.success");
        let requiredTasks = {}
        tasks.forEach(task => {
          requiredTasks[task.taskid] = {...task}
        })
        if (req.body.requirements !== undefined) {
          Object.keys(requiredTasks).forEach(taskid => {
            req.body.requirements.forEach(requirement => {
              if (requiredTasks[taskid][requirement] === undefined) {
                switch (requirement) {
                  case 'name': 
                  case 'description': 
                  requiredTasks[taskid][requirement] = ''
                    break
                  case 'state': 
                  requiredTasks[taskid][requirement] = 'tothink'
                    break
                }
              }
            })
          })
        }
        return res.status(200).json({
          type: "task.getmany.success",
          data: {
            tasks: requiredTasks,
          },
        });
      } else {
        console.log("task.getmany.error.notfound");
        return res.status(101).json({
          type: "task.getmany.error.notfound",
          data: {
            tasks: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("task.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "task.getmany.error.onfind",
        error: error,
        data: {
          tasks: [],
        },
      });
    });
};
