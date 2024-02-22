require("dotenv").config();
const Change = require("../../models/Change.js");
const changeContract = require("./change.contracts.json")

module.exports = changeGetMany = (req, res, next) => {
  /*
  
  sends back all the changes
  
  possible response types
  * change.getmany.success
  * change.getmany.error.notfound
  * change.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("change.getmany");
  }

  let match = { itemid: req.body.itemid }
  if (req.body.changeids !== undefined) {
    if (req.body.changeids.length !== 0) {
      match.changeid = {
        $in: req.body.changeids,
      }
    }
  }

  Change.aggregate([
    {
      $match: match,
    },
    {
      $project: changeContract.change,
    },
  ]).then((changes) => {
      if (changes !== undefined) {
        console.log("change.getmany.success");
        let requiredChanges = {}
        changes.forEach(change => {
          requiredChanges[change.changeid] = {...change}
        })
        if (req.body.requirements !== undefined) {
          Object.keys(requiredChanges).forEach(changeid => {
            req.body.requirements.forEach(requirement => {
              if (requiredChanges[changeid][requirement] === undefined) {
                switch (requirement) {
                  case 'name': 
                  case 'description': 
                  requiredChanges[changeid][requirement] = ''
                    break
                  case 'state': 
                  requiredChanges[changeid][requirement] = 'change'
                    break
                }
              }
            })
          })
        }
        return res.status(200).json({
          type: "change.getmany.success",
          data: {
            changes: requiredChanges,
          },
        });
      } else {
        console.log("change.getmany.error.notfound");
        return res.status(101).json({
          type: "change.getmany.error.notfound",
          data: {
            changes: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("change.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "change.getmany.error.onfind",
        error: error,
        data: {
          changes: [],
        },
      });
    });
};
