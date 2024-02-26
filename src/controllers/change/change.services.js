
// Contracts
let changeContractForChange = {
  "_id": 0,
  "changeid": 1,
  "itemid": 1,
  "author": 1,
  "date": 1,
  "changes": 1
}

// Functions
function checkCreateInputs (change) {
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
function filterChange (change) {
  let filteredChange = {}
  Object.keys(change).forEach(key => {
    if (changeContractForChange[key] === 1) {
      filteredChange[key] = changeContract[key]
    }
  })
  return filteredChange
}
function complementRequirments (requirements, item) {
  let complementedItem = {...item}
  // Return
  return complementedItem
}

module.exports = {
  // Contracts
  changeContractForChange,
  // Functions
  checkCreateInputs,
  filterChange,
  complementRequirments
};