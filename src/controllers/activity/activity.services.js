
// Contracts
let activityContractForMine = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
    "order": 1
}
let activityContractForActivity = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
    "description": 1,
    "tothinks": 1,
    "order": 1
}
let activityContractForToThink = {
    "_id": 0,
    "tothinkid": 1,
    "name": 1,
    "order": 1
}

// Functions
function checkCreateInputs (activity) {
    /*
    {
      activityid: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      order: { type: Number },
    }
    */
    let errors = []
    if (activity.name === "" || activity.name === undefined || activity.name === null) {
      errors.push("empty name")
    }
    if (activity.order === 0 || activity.order === undefined || activity.order === null) {
      errors.push("invalid order")
    }
    return errors
}
function filterActivity (activity) {
    let filteredActivity = {}
    Object.keys(activity).forEach(key => {
      if (activityResource.contracts.activity[key] === 1) {
        filteredActivity[key] = activity[key]
      }
    })
    return filteredActivity
}
function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    if (requirements !== undefined) {
        requirements.forEach(requirement => {
            if (complementedItem[requirement] === undefined) {
                switch (requirement) {
                    case 'name': 
                    case 'description': 
                        complementedItem[requirement] = ''
                        break
                    case 'tothinks':
                        complementedItem[requirement] = []
                        break
                }
            }
        }) 
    }
    // Cleanup
    delete complementedItem.activity
    // Return
    return complementedItem
}

module.exports = {
    // Contracts
    activityContractForMine,
    activityContractForActivity,
    activityContractForToThink,
    // Functions
    checkCreateInputs,
    filterActivity,
    complementRequirments
};