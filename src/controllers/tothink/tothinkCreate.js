require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const ToThink = require("../../models/ToThink.js");
const tothinkContract = require("./tothink.contracts.json")
const changeCreate = require("../change/changeCreate.js")
const complementRequirments = require("./tothink.services.js")

module.exports = tothinkCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * tothink.create.success
  * tothink.create.error.oncreate
  * tothink.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.create");
  }

  // Save
  let tothinkToSave = { ...req.body }
  tothinkToSave.tothinkid = random_string()
  tothinkToSave.owner = req.augmented.user.userid
  if (tothinkToSave.state === undefined) {
    tothinkToSave.state = "tothink"
  }
  tothinkToSave = new ToThink( tothinkToSave );
  tothinkToSave.tothinkid = tothinkToSave._id

  // Save
  tothinkToSave
    .save()
    .then(() => {
      console.log("tothink.create.success");

      // Filtering
      let filteredToThink = {}
      Object.keys(tothinkToSave._doc).forEach(key => {
        if (tothinkContract.activity[key] === 1) {
          filteredToThink[key] = tothinkToSave._doc[key]
        }
      })

      // Change track
      changeCreate(req, {
        itemid: tothinkToSave.tothinkid, 
        command: 'create',
        changes: {...filteredToThink}
      })

      // Meet requirements
      let requiredToThink = {}
      if (req.body.requirements !== undefined) {
        requiredToThink = complementRequirments(req.body.requirements, filteredToThink)
        //console.log("requiredToThink", requiredToThink)
      } else {
        requiredToThink = filteredToThink
      }

      // Response
      return res.status(201).json({
        type: "tothink.create.success",
        data: {
          tothink: requiredToThink,
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
