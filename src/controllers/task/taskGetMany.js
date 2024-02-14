require("dotenv").config();
const Task = require("../../models/Task.js");

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

  Task.find({ userid: req.augmented.user.userid })
    .then((tasks) => {
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
