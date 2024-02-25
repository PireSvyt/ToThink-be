
let states = [
    { 
        "value": "wip",
        "if": (item) => {
            if (isItemValid(item) === false) {
                return true
            }
            return false
        }
    },
    { 
        "value": "active",
        "if": (item) => {
            if (isItemValid(item) === true) {
                if (item.isActive === true) {
                    return true
                }
            }            
            return false
        },
    },
    { 
        "value": "inactive",
        "if": (item) => {
            if (isItemValid(item) === true) {
                if (item.isActive === false) {
                    return true
                }     
            }       
            return false
        },
    },
    { 
        "value": "over",
        "if": (item) => {
            if (isItemValid(item) === true) {
                if (item.isActive === true) {
                    if (item.isRecurring === false) {
                        if (item.dueDate < new Date()) {                        
                            return true
                        }
                    }
                    // OR
                    if (item.endDate < new Date()) {                        
                        return true
                    }
                }
            }              
            return false
        },
    }
]

function isItemValid (item) {
    return true
}

module.exports = function getReminderStates () {
    return states
}