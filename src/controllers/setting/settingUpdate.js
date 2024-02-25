require("dotenv").config();
const Setting = require("../../models/Setting.js");
const { 
  complementRequirments,
  filterSetting
} = require("./setting.services.js")

module.exports = settingUpdate = (req, res, next) => {
  /*
  
  saves a setting
  
  possible response types
  * setting.update.error.key
  * setting.update.success.modified
  * setting.update.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("setting.update");
  }
  
  let settingToSave = { ...req.augmented.setting };

  // Checks


  // Update
  const settingUpdate = {};
  for (const key of Object.keys(req.body)){
    settingUpdate[key] = req.body[key];
  }
  Setting.findOneAndUpdate(
    { settingid: req.body.settingid }, 
    { $set: settingUpdate }, 
    { new: true })
    .then(newSettingState => {
      console.log("setting.update.success.modified");
      //console.log("from:", settingUpdate);
      //console.log("to  :", newSettingState);  
      
      // Meet requirements
      let requiredSetting = complementRequirments(req.body.requirements, {...newSettingState})

      // Filtering
      let filteredSetting = filterSetting({...requiredSetting})

      // No change track

      // Outcome
      let updatedSetting = {}
      for (const key of Object.keys(req.body)){
        updatedSetting[key] = filteredSetting[key];
      }

      // Response
      return res.status(200).json({
        type: "setting.update.success.modified",
        data: {
          setting: updatedSetting,
        },
      });
    })
    .catch((error) => {
      console.log("setting.update.error.onmodify");
      console.error(error);
      return res.status(400).json({
        type: "setting.update.error.onmodify",
        error: error,
      });
    });
};
