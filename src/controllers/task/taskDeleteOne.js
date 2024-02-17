require("dotenv").config();
const Task = require("../../models/Task.js");
const taskContract = require("./task.contracts.json")

module.exports = taskDeleteOne = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * task.deleteone.success
  * task.deleteone.error.outcome
  * task.deleteone.error.ondelete
  
  */

  if (process.env.DEBUG) {
    console.log("task.deleteone");
  }

  Task.deleteOne({ taskid: req.body.taskid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("task.deleteone.success");
        return res.status(200).json({
          type: "task.deleteone.success",
          data: {
            taskid: req.augmented.task.taskid,
            outcome: deleteOutcome,
          }
        });
      } else {
        console.log("task.deleteone.error.outcome");
        return res.status(400).json({
          type: "task.deleteone.error.outcome",
          data: {
            outcome: deleteOutcome,
          }
        });
      }
    })
    .catch((error) => {
      console.log("task.deleteone.error.ondelete");
      console.error(error);
      return res.status(400).json({
        type: "task.deleteone.error.ondelete",
        error: error,
      });
    });
};
