require("dotenv").config();
const Change = require("../../models/Change.js");
const changeContract = require("./change.contracts.json")

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
        $project: changeContract.change,
      },
    ])
    .then((changes) => {
      if (changes !== undefined) {
        console.log("change.getbyitemid.success");
        return {
          type: "change.getbyitemid.success",
          changes: changes
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
