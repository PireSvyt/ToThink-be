require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * user.create.success
  * user.create.error.oncreate
  * user.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("user.create");
  }

  // Save
  let userToSave = { ...req.body };
  userToSave = new User(userToSave);

  // Save
  userToSave
    .save()
    .then(() => {
      console.log("user.create.success");
      return res.status(201).json({
        type: "user.create.success",
        data: {
          userid: userToSave.userid,
        },
      });
    })
    .catch((error) => {
      console.log("user.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "user.create.error.oncreate",
        error: error,
        data: {
          userid: null,
        },
      });
    });
};
