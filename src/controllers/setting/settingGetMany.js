require("dotenv").config();
const Setting = require("../../models/Setting.js");
const { 
  settingContractForSetting, 
  filterSetting, 
  complementRequirments 
} = require("./setting.services.js")

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

  let match = { owner: { $in: [ req.augmented.user.userid, 'allUsers' ] } }
  if (req.body.settingids !== undefined) {
    if (req.body.settingids.length !== 0) {
      match.settingid = {
        $in: req.body.settingids,
      }
    }
  }

  Setting.aggregate([
    {
      $match: match,
    },
    {
      $project: settingContractForSetting,
    },
  ]).then((settings) => {
      if (settings !== undefined) {
        console.log("setting.get.success");
        
        // Meet requirements
        let requiredSettings = {}
        settings.forEach(setting => {
          requiredSettings[setting.settingid] = {...complementRequirments([...req.body.requirements], setting)}
        })

        // Filter
        let filteredTothinks = {}
        settings.forEach(setting => {
          filteredTothinks[setting.settingid] = filterSetting({...requiredSettings[setting.settingid]})
        })

        // Response
        return res.status(200).json({
          type: "setting.getmany.success",
          data: {
            settings: filteredTothinks,
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
