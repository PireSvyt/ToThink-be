require("dotenv").config();
const User = require("../../models/User.js");
const ToThink = require("../../models/ToThink.js");
const Activity = require("../../models/Activity.js");
const Setting = require("../../models/Setting.js");

module.exports = async function adminDatabaseCommand(req, res, next) {
  /*
  
 provides a number of services to set the test database on certain state
 (for testing purpose only)

    * admin.databasecommand.failedconnection
    * admin.databasecommand.error.unmatchedtype
    * admin.databasecommand.missingaction
    * admin.databasecommand.collectionmistmatch
    * admin.databasecommand.missingcollection
    * admin.databasecommand.missingtype
    * ...
  
  */

  if (process.env.DEBUG === true) {
    console.log("admin.databasecommand");
  }
  console.log("action", req.body.action);

  return new Promise((resolve, reject) => {
    let collection = undefined;

    // Action
    if (req.body.action != undefined) {
      // Collection
      if (req.body.action.collection != undefined) {
        if (process.env.DEBUG === true) {
          console.log("action", req.body.action);
        }
        switch (req.body.action.collection) {
          case "users":
            collection = User;
            break;
          case "activities":
            collection = Activity;
            break;
          case "tothinks":
            collection = ToThink;
            break;
          case "settings":
            collection = Setting;
            break;
          case "all":
            // see action.type case "clean up all"
            break;
          default:
            //
            console.log("admin.databasecommand.collectionmistmatch");
            return res.status(400).json({
              type: "admin.databasecommand.collectionmistmatch",
              data: {},
            });
        }

        // Type
        if (req.body.action.type != undefined) {
          switch (req.body.action.type) {
            case "get":
              if (req.body.action.condition != undefined) {
                let match = {};
                let arrayValue = Array.isArray(req.body.action.condition.value)
                  ? req.body.action.condition.value
                  : [req.body.action.condition.value];
                switch (req.body.action.condition.filter) {
                  case "in":
                    match[req.body.action.condition.field] = {
                      $in: arrayValue,
                    };
                    break;
                  case "nin":
                    match[req.body.action.condition.field] = {
                      $ne: arrayValue,
                    };
                    break;
                  case "none":
                    break;
                  default:
                  //
                }
                collection
                  .find(match)
                  .then((itemList) => {
                    if (itemList.length === arrayValue.length) {
                      if (process.env.DEBUG === true) {
                        console.log("admin.databasecommand.get.success");
                      }
                      return res.status(200).json({
                        type: "admin.databasecommand.get.success",
                        data: { items: itemList },
                      });
                    } else {
                      return res.status(400).json({
                        type: "admin.databasecommand.get.error.partialmatch",
                        data: { items: itemList },
                      });
                    }
                  })
                  .catch((error) => {
                    console.log("admin.databasecommand.get.error.onfind");
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.get.error.onfind",
                      error: error,
                      data: {},
                    });
                  });
              } else {
                console.log("admin.databasecommand.get.missingcondition");
                return res.status(400).json({
                  type: "admin.databasecommand.get.missingcondition",
                  data: {},
                });
              }
              break;
            case "insertmany":
              // Type
              if (req.body.action.items != undefined) {
                collection
                  .insertMany(req.body.action.items)
                  .then((insertManyResponse) => {
                    if (process.env.DEBUG === true) {
                      console.log("admin.databasecommand.insertmany.success");
                    }
                    return res.status(200).json({
                      type: "admin.databasecommand.insertmany.success",
                      data: insertManyResponse,
                    });
                  })
                  .catch((error) => {
                    console.log(
                      "admin.databasecommand.insertmany.error.oninstert",
                    );
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.insertmany.error.oninstert",
                      error: error,
                      data: {},
                    });
                  });
              } else {
                console.log("admin.databasecommand.insertmany.missingitems");
                return res.status(400).json({
                  type: "admin.databasecommand.insertmany.missingitems",
                  data: {},
                });
              }
              break;
            case "delete":
              if (process.env.NODE_ENV === "_production") {
                if (process.env.DEBUG === true) {
                  console.log("admin.databasecommand.delete.denied");
                }
                return res.status(403).json({
                  type: "admin.databasecommand.delete.denied",
                  message: "command unauthorized in production",
                });
              } else {
                if (req.body.action.match != undefined) {
                  collection
                    .deleteMany(req.body.action.match)
                    .then((deleteResponse) => {
                      if (process.env.DEBUG === true) {
                        console.log("admin.databasecommand.delete.success");
                      }
                      return res.status(200).json({
                        type: "admin.databasecommand.delete.success",
                        data: deleteResponse,
                      });
                    })
                    .catch((error) => {
                      console.log(
                        "admin.databasecommand.delete.error.ondelete",
                      );
                      console.error(error);
                      return res.status(500).json({
                        type: "admin.databasecommand.delete.error.ondelete",
                        error: error,
                        data: {},
                      });
                    });
                } else {
                  console.log("admin.databasecommand.delete.missingmatch");
                  return res.status(400).json({
                    type: "admin.databasecommand.delete.missingmatch",
                    data: {},
                  });
                }
              }
              break;
            case "drop":
              if (process.env.NODE_ENV === "_production") {
                if (process.env.DEBUG === true) {
                  console.log("admin.databasecommand.drop.denied");
                }
                return res.status(403).json({
                  type: "admin.databasecommand.drop.denied",
                  message: "command unauthorized in production",
                });
              } else {
                collection
                  .drop()
                  .then((dropResponse) => {
                    if (process.env.DEBUG === true) {
                      console.log("admin.databasecommand.drop.success");
                    }
                    return res.status(200).json({
                      type: "admin.databasecommand.drop.success",
                      data: dropResponse,
                    });
                  })
                  .catch((error) => {
                    console.log("admin.databasecommand.drop.error.ondrop");
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.drop.error.ondrop",
                      error: error,
                      data: dropResponse,
                    });
                  });
              }
              break;
            default:
              log.push("ERROR > action type not switched", req.body.action);
              console.log("admin.databasecommand.error.unmatchedtype");
              console.error(error);
              return res.status(400).json({
                type: "admin.databasecommand.error.unmatchedtype",
                error: error,
                data: {},
              });
          }
        } else {
          console.log("admin.databasecommand.missingtype");
          resolve({
            type: "admin.databasecommand.missingtype",
            action: req.body.action,
          });
        }
      } else {
        console.log("admin.databasecommand.missingcollection");
        return res.status(400).json({
          type: "admin.databasecommand.missingcollection",
          data: {},
        });
      }
    } else {
      console.log("admin.databasecommand.missingaction");
      resolve({
        type: "admin.databasecommand.missingaction",
        action: req.body,
      });
    }
  });
};
