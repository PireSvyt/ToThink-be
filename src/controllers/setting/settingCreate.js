require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Setting = require("../../models/Setting.js");
const {
  checkCreateInputs, 
  complementRequirments, 
  filterSetting} = require("./tothink.services.js")

module.exports = settingCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * setting.create.success
  * setting.create.error.oncreate
  * setting.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("setting.create");
  }

  let settingToSave = { ...req.body };
  /*
  {
    key: { type: String, required: true },
    value: {  },
  }
  */
  // Checks
  let errors = checkCreateInputs(activityToSave)
  if (errors.length > 0) {    
    return res.status(403).json({
      type: "setting.create.error.inputs",
      errors: errors
    });
  }

  // Auto fields
  settingToSave.settingid = random_string()
  settingToSave.audience = req.augmented.user.userid
  settingToSave = new Setting(settingToSave);
  settingToSave.settingid = settingToSave._id

  // Save
  settingToSave
    .save()
    .then(() => {
      console.log("setting.create.success");

      // Meet requirements
      let requiredSetting = complementRequirments(req.body.requirements, {...settingToSave._doc})

      // No change track

      // Filtering
      let filteredSetting = filterSetting({...requiredSetting})

      return res.status(201).json({
        type: "setting.create.success",
        data: {
          setting: filteredSetting,
        },
      });
    })
    .catch((error) => {
      console.log("setting.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "setting.create.error.oncreate",
        error: error,
        data: {
          settingid: null,
        },
      });
    });
};
