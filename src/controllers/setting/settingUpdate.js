require("dotenv").config();
const Setting = require("../../models/Setting.js");

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
  
  let settingToSave = { ...req.body };

  // Save
  Setting.updateOne({ key: settingToSave.key }, settingToSave)
    .then(() => {
      console.log("setting.update.success.modified");
      return res.status(200).json({
        type: "setting.update.success.modified",
        data: {
          setting: settingToSave.value,
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
