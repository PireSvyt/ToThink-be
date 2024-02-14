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

  // Save
  Task.updateOne({ 
    taskid: taskToSave.taskid,
    userid: req.augmented.user.userid
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
