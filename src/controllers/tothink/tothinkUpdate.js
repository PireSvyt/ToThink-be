require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const changeCreate = require("../change/changeCreate.js")
const { 
  complementRequirments,
  filterToThink
} = require("./tothink.services.js")

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
    { new: true })
    .then(newToThinkState => {
      console.log("tothink.update.success.modified");
      //console.log("from:", tothinkUpdate);
      //console.log("to  :", newToThinkState);

      // Impacted activities
      let activityids = []
      if (req.augmented.tothink.activityid !== newToThinkState.activityid) {
        if (newToThinkState.activityid !== undefined && newToThinkState.activityid !== "") {
          activityids.push({
            command: "add",
            activityid: newToThinkState.activityid
          })
        }
        if (req.augmented.tothink.activityid !== undefined && req.augmented.tothink.activityid !== "") {
          activityids.push({
            command: "remove",
            activityid: req.augmented.tothink.activityid
          })
        }
      }      
      
      // Meet requirements
      let requiredToThink = complementRequirments(req.body.requirements, {...newToThinkState})

      // Change track
      changeCreate(req, {
        itemid: tothinkToSave.tothinkid, 
        command: 'create',
        changes: {...requiredToThink}
      })

      // Filtering
      let filteredToThink = filterToThink({...requiredToThink})

      // Outcome
      let updatedToThink = {}
      for (const key of Object.keys(req.body)){
        updatedToThink[key] = filteredToThink[key];
      }

      // Response
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
