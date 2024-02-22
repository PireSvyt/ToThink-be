require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const changeCreate = require("../change/changeCreate.js")

module.exports = tothinkDeleteOne = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * tothink.deleteone.success
  * tothink.deleteone.error.outcome
  * tothink.deleteone.error.ondelete
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.deleteone");
  }

  ToThink.deleteOne({ tothinkid: req.body.tothinkid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("tothink.deleteone.success");
        changeCreate(req, {
          itemid: req.body.tothinkid, 
          command: 'delete',
        })
        return res.status(200).json({
          type: "tothink.deleteone.success",
          data: {
            tothinkid: req.augmented.tothink.tothinkid,
            outcome: deleteOutcome,
            dependencies: {
              activityids: [req.augmented.tothink.activityid]
            }
          }
        });
      } else {
        console.log("tothink.deleteone.error.outcome");
        return res.status(400).json({
          type: "tothink.deleteone.error.outcome",
          data: {
            outcome: deleteOutcome,
          }
        });
      }
    })
    .catch((error) => {
      console.log("tothink.deleteone.error.ondelete");
      console.error(error);
      return res.status(400).json({
        type: "tothink.deleteone.error.ondelete",
        error: error,
      });
    });
};
