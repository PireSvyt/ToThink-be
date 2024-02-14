require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userGetAll = (req, res, next) => {
  /*
  
  sends back all the users
  
  possible response types
  * users.get.success
  
  */

  if (process.env.DEBUG) {
    console.log("users.get");
  }

  User.find({})
    .then((users) => {
      if (users !== undefined) {
        console.log("user.get.success");
        return res.status(200).json({
          type: "users.get.success",
          data: {
            users: users,
          },
        });
      } else {
        console.log("user.get.error.notfound");
        return res.status(101).json({
          type: "users.get.error.notfound",
          data: {
            users: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("users.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "users.get.error.onfind",
        error: error,
        data: {
          users: [],
        },
      });
    });
};
