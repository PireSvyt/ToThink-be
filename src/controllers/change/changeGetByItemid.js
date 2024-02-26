require("dotenv").config();
const Change = require("../../models/Change.js");
const { changeContractForChange } = require("./change.services.js")

module.exports = changeGetByItemid = async (itemid) => {

  if (process.env.DEBUG) {
    console.log("change.getbyitemid");
  }

  let match = { itemid: itemid }

  try {
    Change.find([
      {
        $match: match,
      },
      {
        $project: changeContractForChange,
      },
    ])
    .then((changes) => {
      if (changes !== undefined) {
        console.log("change.getbyitemid.success");

        // Meet requirements
        let requiredChanges = {}
        changes.forEach(change => {
          requiredChanges[change.changeid] = complementRequirments(req.body.requirements, change)         
        })

        // Filter
        let filteredChanges = {}
        changes.forEach(change => {
          filteredChanges[change.changeid] = filterActivity({...requiredChanges[change.changeid]})
        })

        return {
          type: "change.getbyitemid.success",
          changes: filteredChanges
        }
      }
    })
  } catch (error) {
    console.log("change.getbyitemid.error");
    console.log(error);
    return {
      type: "change.getbyitemid.error"
    }
  }
};
