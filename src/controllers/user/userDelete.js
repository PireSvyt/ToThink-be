require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * user.delete.success
  * user.delete.error.ondeletegames
  * user.delete.error.ondeleteuser
  
  */

  if (process.env.DEBUG) {
    console.log("user.delete");
  }

  User.deleteOne({ userid: req.params.userid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("user.delete.success");
        return res.status(200).json({
          type: "user.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("user.delete.error.outcome");
        return res.status(400).json({
          type: "user.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("user.delete.error.ondeleteuser");
      console.error(error);
      return res.status(400).json({
        type: "user.delete.error.ondeleteuser",
        error: error,
      });
    });
};
