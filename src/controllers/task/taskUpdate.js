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

  // Checks
  

  // Update
  const taskUpdate = {};
  for (const key of Object.keys(req.body)){
    taskUpdate[key] = req.body[key];
  }
  Activity.findOneAndUpdate(
    { taskid: req.body.taskid }, 
    { $set: taskUpdate }, 
    { new: true })
    .then(newTaskState => {
      console.log("task.update.success.modified", taskUpdate);
      let updatedTask = {}
      for (const key of Object.keys(req.body)){
        updatedTask[key] = newTaskState[key];
      }
      // Impacted activities
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
        data:{
          update: updatedTask,
          dependencies: {
            activityids: activityids
          }
        }
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
