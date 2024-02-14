require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userGetOne = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.get.success
  * user.get.error.onfinduser
  * user.get.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("user.getone");
  }

  User.aggregate([
    {
      $match: { userid: req.param.userid },
    },
    {
      $lookup: {
        from: "patients",
        foreignField: "practicianid",
        localField: "userid",
        as: "patients",
        pipeline: [
          {
            $project: {
              _id: 0,
              patientid: 1,
              practicianid: 1,
              key: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        userid: 1,
        type: 1,
        patients: 1,
      },
    },
  ])
    .then((users) => {
      if (users.length === 1) {
        let userToSend = users[0];
        return res.status(200).json({
          type: "user.get.success",
          data: {
            user: userToSend,
          },
        });
      } else {
        console.log("user.get.error.onfinduser");
        return res.status(400).json({
          type: "user.get.error.onfinduser",
        });
      }
    })
    .catch((error) => {
      console.log("user.get.error.onaggregate");
      console.error(error);
      res.status(400).json({
        type: "user.get.error.onaggregate",
        error: error,
      });
    });
};
