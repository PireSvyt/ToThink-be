const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const adminDatabaseCommand = require("../controllers/admin/adminDatabaseCommand");
const adminGetDatabaseLoad = require("../controllers/admin/adminGetDatabaseLoad.js");

router.post(
  "/v1/databasecommand",
  authAuthenticate,
  adminAuthenticate,
  adminDatabaseCommand,
);
router.get(
  "/v1/databaseload",
  authAuthenticate,
  adminAuthenticate,
  adminGetDatabaseLoad,
);

module.exports = router;
