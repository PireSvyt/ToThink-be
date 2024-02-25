require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const { 
  getTothinkContractForToThink, 
  getTothinkContractForActivity, 
  filterToThink, 
  complementRequirments 
} = require("./tothink.services.js")

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
            $project: getTothinkContractForActivity(),
          },
        ],
      },
    },
    {
      $project: getTothinkContractForToThink(),
    },
  ]).then((tothinks) => {
      if (tothinks !== undefined) {
        console.log("tothink.getmany.success");  
        
        // Meet requirements
        let requiredToThinks = {}
        tothinks.forEach(tothink => {
          requiredToThinks[tothink.tothinkid] = {...complementRequirments([...req.body.requirements], tothink)}
        })

        // Filter
        let filteredTothinks = {}
        tothinks.forEach(tothink => {
          filteredTothinks[tothink.tothinkid] = filterToThink({...requiredToThinks[tothink.tothinkid]})
        })

        // Response
        return res.status(200).json({
          type: "tothink.getmany.success",
          data: {
            tothinks: filteredTothinks,
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
