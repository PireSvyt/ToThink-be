
let states = [
    { 
        "value": "todo",
        "nextable": ['wip', 'blocked', 'done', 'discarded'],
    },
    { 
        "value": "blocked",
        "nextable": ['todo', 'wip', 'done', 'discarded']
    },
    { 
        "value": "onhold", // wip losing last start
        "nextable": ['todo', 'wip', 'blocked', 'done', 'discarded']
    },
    { 
        "value": "wip",
        "nextable": ['todo', 'blocked', 'done', 'discarded']
    },
    { 
        "value": "done",
        "nextable": ['todo', 'wip', 'blocked', 'discarded']
    },
    { 
        "value": "discarded",
        "nextable": ['todo', 'wip', 'blocked', 'done']
    }
]

module.exports = function getTodoStates () {
    return states
}