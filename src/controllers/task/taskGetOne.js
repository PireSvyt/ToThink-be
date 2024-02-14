require("dotenv").config();
const Task = require("../../models/Task.js");

module.exports = taskGetOne = (req, res, next) => {
  /*
  
  sends back the task value
  
  possible response types
  * task.get.success
  * task.get.error.notfound
  * task.get.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("task.getone");
  }

  Task.findOne({ taskid: req.body.taskid })
    .then((task) => {
      if (task !== undefined) {
        console.log("task.get.success");
        return res.status(200).json({
          type: "task.get.success",
          data: {
            task: task,
          },
        });
      } else {
        console.log("task.get.error.notfound");
        return res.status(101).json({
          type: "task.get.error.notfound",
          data: {
            task: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("task.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "task.get.error.onfind",
        error: error,
        data: {
          task: undefined,
        },
      });
    });
};
