const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
//const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticateOwner = require("../controllers/auth/authAuthenticateOwner.js");

const tothinkCreate = require("../controllers/tothink/tothinkCreate.js");
const tothinkUpdate = require("../controllers/tothink/tothinkUpdate.js");
const tothinkGetOne = require("../controllers/tothink/tothinkGetOne.js");
const tothinkGetMany = require("../controllers/tothink/tothinkGetMany.js");
const tothinkDeleteOne = require("../controllers/tothink/tothinkDeleteOne.js");
const tothinkGetChanges = require("../controllers/tothink/tothinkGetChanges.js");

router.post(
  "/v1/create",
  authAuthenticate,
  tothinkCreate,
);
router.post(
  "/v1/update",
  authAuthenticate,
  authAuthenticateOwner,
  tothinkUpdate,
);
router.post(
  "/v1/getone",
  authAuthenticate,
  authAuthenticateOwner,
  tothinkGetOne,
);
router.post(
  "/v1/getmany",
  authAuthenticate,
  tothinkGetMany,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticateOwner,
  tothinkDeleteOne,
);
router.post(
  "/v1/gethistory",
  authAuthenticate,
  authAuthenticateOwner,
  tothinkGetChanges,
);

module.exports = router;
