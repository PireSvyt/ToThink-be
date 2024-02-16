require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingGetMany = (req, res, next) => {
  /*
  
  sends back all the settings
  
  possible response types
  * setting.getmany.success
  * setting.getmany.error.notfound
  * setting.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getmany");
  }

  Setting.find({})
    .then((settings) => {
      if (settings !== undefined) {
        console.log("setting.get.success");
        return res.status(200).json({
          type: "setting.getmany.success",
          data: {
            settings: settings,
          },
        });
      } else {
        console.log("setting.get.error.notfound");
        return res.status(101).json({
          type: "setting.getmany.error.notfound",
          data: {
            settings: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("setting.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "setting.getmany.error.onfind",
        error: error,
        data: {
          settings: [],
        },
      });
    });
};
