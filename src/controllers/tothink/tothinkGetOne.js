require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const { 
  getTothinkContractForToThink, 
  getTothinkContractForActivity, 
  filterToThink, 
  complementRequirments 
} = require("./tothink.services.js")

module.exports = tothinkGetOne = (req, res, next) => {
  /*
  
  sends back the tothink value
  
  possible response types
  * tothink.getone.success
  * tothink.getone.error.notfound
  * tothink.getone.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.getone");
  }

  ToThink.aggregate([
    {
      $match: { tothinkid: req.body.tothinkid },
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
  ]).then((tothink) => {
      if (tothink !== undefined) {
        console.log("tothink.getone.success");

        // Meet requirements
        let requiredToThink = complementRequirments(req.body.requirements, tothink)

        // Filter
        let filteredToThink = filterToThink(requiredToThink)

        return res.status(200).json({
          type: "tothink.getone.success",
          data: {
            tothink: filteredToThink,
          },
        });
      } else {
        console.log("tothink.getone.error.notfound");
        return res.status(101).json({
          type: "tothink.getone.error.notfound",
          data: {
            tothink: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("tothink.getone.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "tothink.getone.error.onfind",
        error: error,
        data: {
          tothink: undefined,
        },
      });
    });
};
