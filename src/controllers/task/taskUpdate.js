require("dotenv").config();
const Task = require("../../models/Task.js");

module.exports = taskSave = (req, res, next) => {
  /*
  
  saves a task
  
  possible response types
  * task.update.error.taskid
  * task.update.success.modified
  * task.update.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("task.update");
  }

  let taskToSave = { ...req.body };

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
    if (supportedStates.includes(req.body.state)) {
      taskToSave.state = req.body.state
    }
  }

  // Save
  Task.updateOne({ 
    taskid: taskToSave.taskid,
    owner: req.augmented.user.userid
  }, taskToSave)
    .then(() => {
      console.log("task.update.success.modified");
      return res.status(200).json({
        type: "task.update.success.modified",
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
