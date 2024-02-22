
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    requirements.forEach(requirement => {
        if (complementedItem[requirement] === undefined) {
            switch (requirement) {
                case 'name': 
                case 'description': 
                case 'activityid': 
                    requiredToThinks[requirement] = ''
                    break
                case 'state': 
                    requiredToThinks[requirement] = 'tothink'
                    break
                case 'dueDate': 
                case 'recurring': 
                case 'recurrence': 
                    requiredToThinks[requirement] = null
                    break
            }
        }
    })
    return complementedItem
}