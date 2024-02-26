
let settingContract = {
    "_id": 0,
    "settingid": 1,
    "audience": 0,
    "key": 1,
    "value": 1
  }

function checkCreateInputs (setting) {
    /*
    {
      i?
    }
    */
    let errors = []
    return errors
}
function getSettingContractForSetting () {
    return settingContract
}
function filterSetting (setting) {
    let filteredSetting = {}
    Object.keys(setting).forEach(key => {
      if (settingContract[key] === 1) {
        filteredSetting[key] = settingContract[key]
      }
    })
    return filteredSetting
}
function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    // Return
    return complementedItem
}

module.exports = { 
    checkCreateInputs,
    getSettingContractForSetting,
    filterSetting,
    complementRequirments
};