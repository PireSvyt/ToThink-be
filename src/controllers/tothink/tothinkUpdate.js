require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const tothinkContract = require("./tothink.contracts.json")

module.exports = tothinkUpdate = (req, res, next) => {
  /*
  
  saves a tothink
  
  possible response types
  * tothink.update.error.tothinkid
  * tothink.update.success.modified
  * tothink.update.error.onmodify
  * tothink.update.error.invalidstate
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.update");
  }

  let tothinkToSave = { ...req.augmented.tothink };

  // Checks
  

  // Update
  const tothinkUpdate = {};
  for (const key of Object.keys(req.body)){
    tothinkUpdate[key] = req.body[key];
  }
  ToThink.findOneAndUpdate(
    { tothinkid: req.body.tothinkid }, 
    { $set: tothinkUpdate }, 
    { $push: { 
      history: {
        date: new Date(),
        command: 'update',
        change: {...tothinkUpdate} 
      }}
    },
    { new: true })
    .then(newToThinkState => {
      console.log("tothink.update.success.modified", tothinkUpdate);
      let updatedToThink = {}
      for (const key of Object.keys(req.body)){
        updatedToThink[key] = newToThinkState[key];
      }
      // Impacted activities
      let activityids = []
      if (req.augmented.tothink.activityid !== updatedToThink.activityid) {
        if (updatedToThink.activityid !== undefined && updatedToThink.activityid !== "") {
          activityids.push(updatedToThink.activityid)
        }
        if (req.augmented.tothink.activityid !== undefined && req.augmented.tothink.activityid !== "") {
          activityids.push(req.augmented.tothink.activityid)
        }
      }      
      return res.status(200).json({
        type: "tothink.update.success.modified",
        data:{
          update: updatedToThink,
          dependencies: {
            activityids: activityids
          }
        }
      });
    })
    .catch((error) => {
      console.log("tothink.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "tothink.update.error.onmodify",
        error: error,
      });
    });
};
