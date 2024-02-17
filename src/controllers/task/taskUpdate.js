require("dotenv").config();
const Task = require("../../models/Task.js");
const taskContract = require("./task.contracts.json")

module.exports = taskUpdate = (req, res, next) => {
  /*
  
  saves a task
  
  possible response types
  * task.update.error.taskid
  * task.update.success.modified
  * task.update.error.onmodify
  * task.update.error.invalidstate
  
  */

  if (process.env.DEBUG) {
    console.log("task.update");
  }

  let taskToSave = { ...req.augmented.task };

  // Updates
  if (req.body.name !== undefined) {
    taskToSave.name = req.body.name
  }
  if (req.body.description !== undefined) {
    taskToSave.description = req.body.description
  }
  if (req.body.activityid !== undefined) {
    taskToSave.activityid = req.body.activityid
  }
  if (req.body.state !== undefined) {
    let supportedStates = [ 'tothink', 'todo', 'wip', 'block', 'done']
    if (supportedStates.indexOf(req.body.state) > -1) {
      taskToSave.state = req.body.state
    } else {
      return res.status(403).json({
        type: "task.update.error.invalidstate",
      });
    }
  }
  console.log("taskToSave", taskToSave)

  // Save
  Task.updateOne({ 
    taskid: taskToSave.taskid
  }, taskToSave)
    .then(() => {
      console.log("task.update.success.modified");
      let filteredTask = {}
      Object.keys(taskToSave._doc).forEach(key => {
        if (taskContract.activity[key] === 1) {
          filteredTask[key] = taskToSave._doc[key]
        }
      })
      let activityids = []
      if (req.augmented.task.activityid !== filteredTask.activityid) {
        if (filteredTask.activityid !== undefined && filteredTask.activityid !== "") {
          activityids.push(filteredTask.activityid)
        }
        if (req.augmented.task.activityid !== undefined && req.augmented.task.activityid !== "") {
          activityids.push(req.augmented.task.activityid)
        }
      }
      return res.status(200).json({
        type: "task.update.success.modified",
        data: {
          task: filteredTask,
          dependencies: {
            activityids: activityids
          }
        },
      });
    })
    .catch((error) => {
      console.log("task.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "task.update.error.onmodify",
        error: error,
      });
    });
};
