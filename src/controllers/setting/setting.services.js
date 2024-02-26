// Contracts
let settingContractForSetting = {
  "_id": 0,
  "settingid": 1,
  "audience": 0,
  "key": 1,
  "value": 1
}

// Functions
function checkCreateInputs (setting) {
  /*
  {
    i?
  }
  */
  let errors = []
  return errors
}
function filterSetting (setting) {
  let filteredSetting = {}
  Object.keys(setting).forEach(key => {
    if (settingContractForSetting[key] === 1) {
      filteredSetting[key] = setting[key]
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
  // Contracts
  settingContractForSetting,
  // Functions
  checkCreateInputs,
  filterSetting,
  complementRequirments
};
