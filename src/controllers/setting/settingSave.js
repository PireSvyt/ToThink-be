require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingSave = (req, res, next) => {
  /*
  
  saves a setting
  
  possible response types
  * setting.save.error.key
  * setting.save.success.modified
  * setting.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("setting.save");
  }

  // Save
  if (req.body.key === "" || req.body.key === undefined) {
    console.log("setting.save.error.key");
    return res.status(503).json({
      type: "setting.save.error.key",
      error: error,
    });
  } else {
    // Modify
    let settingToSave = { ...req.body };

    // Save
    Setting.updateOne({ key: settingToSave.key }, settingToSave)
      .then(() => {
        console.log("setting.save.success.modified");
        return res.status(200).json({
          type: "setting.save.success.modified",
          data: {
            setting: settingToSave.value,
          },
        });
      })
      .catch((error) => {
        console.log("setting.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "setting.save.error.onmodify",
          error: error,
        });
      });
  }
};
