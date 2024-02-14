require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userGetOne = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.getme.success
  * user.getme.error.onfinduser
  * user.getme.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("user.getme");
  }

  User.aggregate([
    {
      $match: { userid: req.augmented.user.userid },
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
              //practicianid: 1,
              name: 1,
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
          type: "user.getme.success",
          data: {
            user: userToSend,
          },
        });
      } else {
        console.log("user.getme.error.onfinduser");
        return res.status(400).json({
          type: "user.getme.error.onfinduser",
        });
      }
    })
    .catch((error) => {
      console.log("user.getme.error.onaggregate");
      console.error(error);
      res.status(400).json({
        type: "user.getme.error.onaggregate",
        error: error,
      });
    });
};
