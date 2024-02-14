const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const userCreate = require("../controllers/user/userCreate.js");
const userSave = require("../controllers/user/userSave.js");
const userGetOne = require("../controllers/user/userGetOne.js");
const userGetMe = require("../controllers/user/userGetMe.js");
const userGetAll = require("../controllers/user/userGetAll.js");
const userDelete = require("../controllers/user/userDelete.js");

router.post("/v1/create", authAuthenticate, adminAuthenticate, userCreate);
router.post("/v1/save", authAuthenticate, adminAuthenticate, userSave);
router.get("/v1/all", authAuthenticate, adminAuthenticate, userGetAll);
router.get("/v1/:userid", authAuthenticate, adminAuthenticate, userGetOne);
router.get("/v1", authAuthenticate, userGetMe);
router.delete("/v1/:userid", authAuthenticate, adminAuthenticate, userDelete);

module.exports = router;
