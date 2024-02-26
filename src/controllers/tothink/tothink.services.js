// Contracts
let tothinkContractForToThink = {
    "_id": 0,
    "tothinkid": 1,
    "activityid": 1,
    "name": 1,
    "state": 1,
    "description": 1,
    "activity": 1, // TODO : to remove?
    "order": 1,
    "reminders": 1,
    "todos": 1,
}
let tothinkContractForActivity = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
}

// Functions
function checkCreateInputs (tothink) {
    let errors = []
    if (tothink.activityid === "") {
        errors.push("missing activityid")
    }
    /*if (tothinkToSave.order === 0 || tothinkToSave.order === undefined || tothinkToSave.order === null) {
    errors.push("invalid order")
    }*/
    return errors
}
function filterToThink (tothink) {
    let filteredToThink = {}
    Object.keys(tothink).forEach(key => {
      if (tothinkContractForToThink[key] === 1) {
        filteredToThink[key] = tothink[key]
      }
    })
    return filteredToThink
}
function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    if (requirements !== undefined) {
        requirements.forEach(requirement => {
            if (complementedItem[requirement] === undefined) {
                switch (requirement) {
                    case 'name': 
                    case 'description': 
                    case 'activityid': 
                        complementedItem[requirement] = ''
                        break
                    case 'dueDate': 
                    case 'recurrence': 
                        complementedItem[requirement] = null
                        break
                    case 'isActive':
                        complementedItem[requirement] = true
                        break
                    case 'isRecurring': 
                        complementedItem[requirement] = false
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
    tothinkContractForToThink,
    tothinkContractForActivity,
    // Functions
    checkCreateInputs,
    filterToThink,
    complementRequirments
};