require("dotenv").config();
const Task = require("../../models/Task.js");

module.exports = taskCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * task.create.success
  * task.create.error.oncreate
  * task.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("task.create");
  }

  // Save
  let taskToSave = { ...req.body };
  taskToSave = new Task(taskToSave);

  // Save
  taskToSave
    .save()
    .then(() => {
      console.log("task.create.success");
      return res.status(201).json({
        type: "task.create.success",
        data: {
          taskid: taskToSave.taskid,
        },
      });
    })
    .catch((error) => {
      console.log("task.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "task.create.error.oncreate",
        error: error,
        data: {
          taskid: null,
        },
      });
    });
};
