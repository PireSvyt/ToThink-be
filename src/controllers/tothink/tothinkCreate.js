require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const ToThink = require("../../models/ToThink.js");
const changeCreate = require("../change/changeCreate.js")
const {
  checkCreateInputs, 
  complementRequirments, 
  filterToThink} = require("./tothink.services.js")

module.exports = tothinkCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * tothink.create.success
  * tothink.create.error.inputs
  * tothink.create.error.oncreate
  * tothink.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.create");
  }

  let tothinkToSave = { ...req.body.tothink }

  // Checks
  let errors = checkCreateInputs(tothinkToSave)
  if (errors.length > 0) {    
    return res.status(403).json({
      type: "tothink.create.error.inputs",
      errors: errors
    });
  }

  // Auto fields
  tothinkToSave.tothinkid = random_string()
  tothinkToSave.owner = req.augmented.user.userid
  tothinkToSave = new ToThink( tothinkToSave );
  tothinkToSave.tothinkid = tothinkToSave._id

  // Save
  tothinkToSave
    .save()
    .then(() => {
      console.log("tothink.create.success");

      // Meet requirements
      let requiredToThink = complementRequirments(req.body.requirements, {...tothinkToSave._doc})

      // Change track
      changeCreate(req, {
        itemid: tothinkToSave.tothinkid, 
        command: 'create',
        changes: {...requiredToThink}
      })

      // Filtering
      let filteredToThink = filterToThink({...requiredToThink})

      // Response
      return res.status(201).json({
        type: "tothink.create.success",
        data: {
          tothink: filteredToThink,
          dependencies: {
            activityids: [filteredToThink.activityid]
          }
        },
      });

    })
    .catch((error) => {
      console.log("tothink.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "tothink.create.error.oncreate",
        error: error,
        data: {
          tothinkid: null,
        },
      });
    });
};
