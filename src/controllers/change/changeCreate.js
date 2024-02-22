require("dotenv").config();
const random_string = require("../../resources/random_string.js");
const Change = require("../../models/Change.js");

module.exports = changeCreate = async (req, change) => {

  if (process.env.DEBUG) {
    console.log("change.create");
  }

  // Save
  let changeToSave = { ...change }
  /*
  {
    itemid: { type: String }, 
    command: { type: String },
    changes: { type: Object}
  }
    */
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
