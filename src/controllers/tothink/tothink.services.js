
let tothinkContract = {
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
let activityContract = {
    "_id": 0,
    "activityid": 1,
    "name": 1,
}
let states = [
    { 
        "value": "tothink",
        "if": (item) => {
            if (item.reminders !== undefined) {
             if (item.reminders.length === 0) {
                return true
             }
             // OR
             if (item.reminders.filter(reminder => {reminder.state === 'wip'}).length > 0) {
                return true
             }
            }
            return false
        }
    },
    { 
        "value": "planned",
        "if": (item) => {
            if (item.reminders !== undefined) {
             if (item.reminders.filter(reminder => {reminder.state === 'active'}).length > 0) {
                if (item.reminders.filter(reminder => {reminder.state === 'wip'}).length === 0) {
                    return true
                }
             }
            }
            return false
        },
    },
    { 
        "value": "over",
        "if": (item) => {
            if (item.reminders !== undefined) {
                if (item.reminders.filter(reminder => {reminder.state === 'wip'}).length === 0) {
                    if (item.reminders.filter(reminder => {reminder.state === 'inactive'}).length > 0) {
                        return true
                    }
                    // OR
                    if (item.reminders.filter(reminder => {reminder.state === 'over'}).length === 0) {
                        return true
                    }
                    return false
                }
             
            }
            return false
        },
    }
]

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
function getTothinkContractForToThink () {
    return tothinkContract
}
function getTothinkContractForActivity () {
    return activityContract
}
function getStateList () {
    return states.map(state => state.value)
}
function getToThinkStates () {
    return states
}
function filterToThink (tothink) {
    let filteredToThink = {}
    Object.keys(tothink).forEach(key => {
      if (activityContract[key] === 1) {
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
    checkCreateInputs,
    getTothinkContractForToThink,
    getTothinkContractForActivity,
    getStateList,
    getToThinkStates,
    filterToThink,
    complementRequirments
};