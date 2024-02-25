
let mineContract = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
    "order": 1
}
let activityContract = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
    "description": 1,
    "tothinks": 1,
    "order": 1
}
let tothinkContract = {
    "_id": 0,
    "tothinkid": 1,
    "name": 1,
    "order": 1
}

module.exports = function checkCreateInputs (activity) {
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
module.exports = function getActivityContractForMine () {
    return mineContract
}
module.exports = function getActivityContractForActivity () {
    return activityContract
}
module.exports = function getActivityContractForToThink () {
    return tothinkContract
}
module.exports = function filterActivity (activity) {
    let filteredActivity = {}
    Object.keys(activity).forEach(key => {
      if (activityContract[key] === 1) {
        filteredActivity[key] = activity[key]
      }
    })
    return filteredActivity
}
module.exports = function complementRequirments (requirements, item) {
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