require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingGetOne = (req, res, next) => {
  /*
  
  sends back the setting value
  
  possible response types
  * setting.get.success
  * setting.get.error.notfound
  * setting.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getone");
  }

  Setting.findOne({ key: req.params.key }, "value type")
    .then((setting) => {
      if (setting !== undefined) {
        console.log("setting.get.success");
        let value;
        switch (setting.type) {
          case "string":
            value = setting.value;
            break;
          default:
        }
        return res.status(200).json({
          type: "setting.get.success",
          data: {
            setting: value,
          },
        });
      } else {
        console.log("setting.get.error.undefined");
        return res.status(101).json({
          type: "setting.get.error.undefined",
          data: {
            setting: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("setting.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "setting.get.error.onfind",
        error: error,
        data: {
          setting: undefined,
        },
      });
    });
};
