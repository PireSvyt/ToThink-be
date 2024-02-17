const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
//const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticateOwner = require("../controllers/auth/authAuthenticateOwner.js");

const taskCreate = require("../controllers/task/taskCreate.js");
const taskUpdate = require("../controllers/task/taskUpdate.js");
const taskGetOne = require("../controllers/task/taskGetOne.js");
const taskGetMany = require("../controllers/task/taskGetMany.js");
const taskDeleteOne = require("../controllers/task/taskDeleteOne.js");

router.post(
  "/v1/create",
  authAuthenticate,
  taskCreate,
);
router.post(
  "/v1/update",
  authAuthenticate,
  authAuthenticateOwner,
  taskUpdate,
);
router.post(
  "/v1/getone",
  authAuthenticate,
  authAuthenticateOwner,
  taskGetOne,
);
router.post(
  "/v1/getmany",
  authAuthenticate,
  taskGetMany,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticateOwner,
  taskDeleteOne,
);

module.exports = router;
