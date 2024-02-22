
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
    requirements.forEach(requirement => {
        if (complementedItem[requirement] === undefined) {
            switch (requirement) {
                case 'name': 
                case 'description': 
                    requiredToThinks[requirement] = ''
                    break
                case 'tothinks':
                    requiredToThinks[requirement] = []
                    break
            }
        }
    })
    return complementedItem
}