require("dotenv").config();
const { getToThinkStates } = require("../tothink/tothink.services.js")
const { getReminderStates } = require("../reminder/reminder.services.js")
const { getTodoStates } = require("../todo/todo.services.js")

module.exports = settingGetDefaults = (req, res, next) => {
  /*
  
  sends back the default settings
  
  possible response types
  * setting.getdefaults.success
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getdefaults");
  }

  // Tothink states
  let tothinkStates = [...getToThinkStates()]
  tothinkStates.forEach(tothinkState => {
    tothinkState.if = tothinkState.if.toString()
  });

  // Tothink states
  let reminderStates = [...getReminderStates()]
  reminderStates.forEach(reminderState => {
    reminderState.if = reminderState.if.toString()
  });

  // Todo states
  let todoStates = [...getTodoStates()]

  return res.status(200).json({
    type: "setting.getdefaults.success",
    data: {
        states: {
            tothink: tothinkStates,
            reminder: reminderStates,
            todo: todoStates
        }
    },
  });
};
