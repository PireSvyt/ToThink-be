
module.exports = function complementRequirments (requirements, item) {
    let complementedItem = {...item}
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
    // Cleanup
    delete complementedItem.activity
    // Result
    return complementedItem
}