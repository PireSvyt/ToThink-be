require("dotenv").config();
const Task = require("../../models/Task.js");

module.exports = taskDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * task.delete.success
  * task.delete.error.outcome
  * task.delete.error.ondelete
  
  */

  if (process.env.DEBUG) {
    console.log("task.delete");
  }

  Task.deleteOne({ taskid: req.body.taskid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("task.delete.success");
        return res.status(200).json({
          type: "task.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("task.delete.error.outcome");
        return res.status(400).json({
          type: "task.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("task.delete.error.ondelete");
      console.error(error);
      return res.status(400).json({
        type: "task.delete.error.ondelete",
        error: error,
      });
    });
};
