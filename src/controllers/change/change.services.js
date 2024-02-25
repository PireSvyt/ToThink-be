
let changeContract = {
    "_id": 0,
    "changeid": 1,
    "itemid": 1,
    "author": 1,
    "date": 1,
    "changes": 1
  }

module.exports = function checkCreateInputs (change) {
    /*
    {
      itemid: { type: String }, 
      command: { type: String },
      changes: { type: Object}
    }
    */
    let errors = []
    return errors
}
module.exports = function getChangeContractForChange () {
    return changeContract
}
module.exports = function filterChange (change) {
    let filteredChange = {}
    Object.keys(change).forEach(key => {
      if (changeContract[key] === 1) {
        filteredChange[key] = changeContract[key]
      }
    })
    return filteredChange
}
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    // Return
    return complementedItem
}