require("dotenv").config();
const { todoStateSelectableValues } = require("../todo/todo.services.js")

module.exports = settingGetDefaults = (req, res, next) => {
  /*
  
  sends back the default settings
  
  possible response types
  * setting.getdefaults.success
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getdefaults");
  }

  // Todo states
  let todoStates = todoStateSelectableValues

  return res.status(200).json({
    type: "setting.getdefaults.success",
    data: {
      defaults: {
        states: {
          todo: todoStates
        }
      }
    },
  });
};
