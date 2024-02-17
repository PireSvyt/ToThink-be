require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Task = require("../../models/Task.js");
const taskContract = require("./task.contracts.json")

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
  let taskToSave = { ...req.body }
  taskToSave.taskid = random_string()
  taskToSave.owner = req.augmented.user.userid
  if (taskToSave.state === undefined) {
    taskToSave.state = "tothink"
  }
  taskToSave = new Task( taskToSave );
  taskToSave.taskid = taskToSave._id

  // Save
  taskToSave
    .save()
    .then(() => {
      console.log("task.create.success");
      let filteredTask = {}
      Object.keys(taskToSave._doc).forEach(key => {
        if (taskContract.activity[key] === 1) {
          filteredTask[key] = taskToSave._doc[key]
        }
      })
      // impacted activities
      return res.status(201).json({
        type: "task.create.success",
        data: {
          task: filteredTask,
          dependencies: {
            activityids: [filteredTask.activityid]
          }
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
