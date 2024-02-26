const activityResource = require("./activity.resource.json")

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
    return activityResource.contracts.mine
}
module.exports = function getActivityContractForActivity () {
    return activityResource.contracts.activity
}
module.exports = function getActivityContractForToThink () {
    return activityResource.contracts.tothink
}
module.exports = function filterActivity (activity) {
    let filteredActivity = {}
    Object.keys(activity).forEach(key => {
      if (activityResource.contracts.activity[key] === 1) {
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