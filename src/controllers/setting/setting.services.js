
let settingContract = {
    "_id": 0,
    "settingid": 1,
    "audience": 0,
    "key": 1,
    "value": 1
  }

module.exports = function checkCreateInputs (setting) {
    /*
    {
      i?
    }
    */
    let errors = []
    return errors
}
module.exports = function getSettingContractForSetting () {
    return settingContract
}
module.exports = function filterSetting (setting) {
    let filteredSetting = {}
    Object.keys(setting).forEach(key => {
      if (settingContract[key] === 1) {
        filteredSetting[key] = settingContract[key]
      }
    })
    return filteredSetting
}
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    // Return
    return complementedItem
}