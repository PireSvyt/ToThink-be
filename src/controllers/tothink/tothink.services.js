
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    requirements.forEach(requirement => {
        if (complementedItem[requirement] === undefined) {
            switch (requirement) {
                case 'name': 
                case 'description': 
                case 'activityid': 
                    complementedItem[requirement] = ''
                    break
                case 'state': 
                    complementedItem[requirement] = 'tothink'
                    break
                case 'dueDate': 
                case 'recurring': 
                case 'recurrence': 
                    complementedItem[requirement] = null
                    break
            }
        }
    })
    return complementedItem
}