const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
//const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticateOwner = require("../controllers/auth/authAuthenticateOwner.js");

const activityCreate = require("../controllers/activity/activityCreate.js");
const activityUpdate = require("../controllers/activity/activityUpdate.js");
const activityGetOne = require("../controllers/activity/activityGetOne.js");
const activityGetMany = require("../controllers/activity/activityGetMany.js");
const activityGetMine = require("../controllers/activity/activityGetMine.js");
const activityDeleteOne = require("../controllers/activity/activityDeleteOne.js");
const activityGetHistory = require("../controllers/activity/activityGetHistory.js");

router.post(
  "/v1/create",
  authAuthenticate,
  activityCreate,
);
router.post(
  "/v1/update",
  authAuthenticate,
  authAuthenticateOwner,
  activityUpdate,
);
router.post(
  "/v1/getone",
  authAuthenticate,
  authAuthenticateOwner,
  activityGetOne,
);
router.post(
  "/v1/getmany",
  authAuthenticate,
  activityGetMany,
);
router.post(
  "/v1/getmine",
  authAuthenticate,
  activityGetMine,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticateOwner,
  activityDeleteOne,
);
router.post(
  "/v1/gethistory",
  authAuthenticate,
  authAuthenticateOwner,
  activityGetHistory,
);

module.exports = router;
