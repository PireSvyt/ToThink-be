require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const tothinkContract = require("./tothink.contracts.json")

module.exports = tothinkGetMany = (req, res, next) => {
  /*
  
  sends back all the tothinks
  
  possible response types
  * tothink.getmany.success
  * tothink.getmany.error.notfound
  * tothink.getmany.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.getmany");
  }

  let match = { owner: req.augmented.user.userid }
  if (req.body.tothinkids !== undefined) {
    if (req.body.tothinkids.length !== 0) {
      match.tothinkid = {
        $in: req.body.tothinkids,
      }
    }
  }

  ToThink.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "activities",
        foreignField: "activityid",
        localField: "activityid",
        as: "activity",
        pipeline: [
          {
            $project: tothinkContract.activity,
          },
        ],
      },
    },
    {
      $project: tothinkContract.tothink,
    },
  ]).then((tothinks) => {
      if (tothinks !== undefined) {
        console.log("tothink.getmany.success");
        let requiredToThinks = {}
        tothinks.forEach(tothink => {
          requiredToThinks[tothink.tothinkid] = {...tothink}
        })
        if (req.body.requirements !== undefined) {
          Object.keys(requiredToThinks).forEach(tothinkid => {
            req.body.requirements.forEach(requirement => {
              if (requiredToThinks[tothinkid][requirement] === undefined) {
                switch (requirement) {
                  case 'name': 
                  case 'description': 
                  requiredToThinks[tothinkid][requirement] = ''
                    break
                  case 'state': 
                  requiredToThinks[tothinkid][requirement] = 'tothink'
                    break
                }
              }
            })
          })
        }
        return res.status(200).json({
          type: "tothink.getmany.success",
          data: {
            tothinks: requiredToThinks,
          },
        });
      } else {
        console.log("tothink.getmany.error.notfound");
        return res.status(101).json({
          type: "tothink.getmany.error.notfound",
          data: {
            tothinks: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("tothink.getmany.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "tothink.getmany.error.onfind",
        error: error,
        data: {
          tothinks: [],
        },
      });
    });
};
