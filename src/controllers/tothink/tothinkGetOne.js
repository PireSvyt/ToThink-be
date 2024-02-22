require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const tothinkContract = require("./tothink.contracts.json")

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
            $project: tothinkContract.activity,
          },
        ],
      },
    },
    {
      $project: tothinkContract.tothink,
    },
  ]).then((tothink) => {
      if (tothink !== undefined) {
        console.log("tothink.getone.success");
        return res.status(200).json({
          type: "tothink.getone.success",
          data: {
            tothink: tothink,
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