require("dotenv").config();
const changeGetByItemid = require("../change/changeGetByItemid.js")

module.exports = tothinkGetChanges = (req, res, next) => {
  /*
  
  sends back the tothink changes
  
  possible response types
  * tothink.getchanges.success
  * tothink.getchanges.error.notfound
  * tothink.getchanges.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tothink.getchanges");
  }

  changeGetByItemid(req.body.tothinkid)
  .then((tothinkChanges) => {
    if (tothinkChanges.type === "change.getbyitemid.success") {
      console.log("tothink.getchanges.success");
      return res.status(200).json({
        type: "tothink.getchanges.success",
        data: {
          changes: tothinkChanges.changes,
        },
      });
    } else {
      console.log("tothink.getchanges.error.notfound");
      return res.status(101).json({
        type: "tothink.getchanges.error.notfound",
        data: {
          changes: undefined,
        },
      });
    }
  })
  .catch((error) => {
    console.log("tothink.getchanges.error.onfind");
    console.error(error);
    return res.status(400).json({
      type: "tothink.getchanges.error.onfind",
      error: error,
      data: {
        changes: undefined,
      },
    });
  });
};
