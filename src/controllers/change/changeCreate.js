require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Change = require("../../models/Change.js");
const { checkCreateInputs } = require("./change.services.js")

module.exports = changeCreate = async (req, change) => {

  if (process.env.DEBUG) {
    console.log("change.create");
  }

  let changeToSave = { ...change }
  /*
  {
    itemid: { type: String }, 
    command: { type: String },
    changes: { type: Object}
  }
  */
  // Checks
  let errors = checkCreateInputs(activityToSave)
  if (errors.length > 0) {    
    return res.status(403).json({
      type: "change.create.error.inputs",
      errors: errors
    });
  }

  // Auto fields
  changeToSave.changeid = random_string()
  changeToSave.author = req.augmented.user.userid
  changeToSave.date = new Date()
  changeToSave = new Change( changeToSave );
  changeToSave.changeid = changeToSave._id

  // Save
  try {
    changeToSave
        .save()
        .then(() => {
        console.log("change.create.success");
        })
  } catch (error) {
    console.log("change.create.error");
    console.log(error);
  }
};
