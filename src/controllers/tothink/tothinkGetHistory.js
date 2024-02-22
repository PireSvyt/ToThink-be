require("dotenv").config();
const ToThink = require("../../models/ToThink.js");
const tothinkContract = require("./tothink.contracts.json")

module.exports = tothinkGetHistory = (req, res, next) => {
  /*
  
  sends back the tothink value
  
  possible response types
  * tothink.gethistory.success
  * tothink.gethistory.error.notfound
  * tothink.gethistory.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.gethistory");
  }

  ToThink.findOne([
    {
      $match: { tothinkid: req.body.tothinkid },
    },
    {
      $project: { 
        _id: 0,
        tothinkid: 1,
        history: 1
      },
    },
  ]).then((tothinkHistory) => {
      if (tothinkHistory !== undefined) {
        console.log("tothink.gethistory.success");
        return res.status(200).json({
          type: "tothink.gethistory.success",
          data: {
            history: tothinkHistory,
          },
        });
      } else {
        console.log("tothink.gethistory.error.notfound");
        return res.status(101).json({
          type: "tothink.gethistory.error.notfound",
          data: {
            history: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("tothink.gethistory.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "tothink.gethistory.error.onfind",
        error: error,
        data: {
          history: undefined,
        },
      });
    });
};