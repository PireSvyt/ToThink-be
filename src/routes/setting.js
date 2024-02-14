const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const settingCreate = require("../controllers/setting/settingCreate.js");
const settingUpdate = require("../controllers/setting/settingUpdate.js");
const settingGetOne = require("../controllers/setting/settingGetOne.js");
const settingGetMany = require("../controllers/setting/settingGetMany.js");
const settingDelete = require("../controllers/setting/settingDelete.js");

router.post("/v1/create", authAuthenticate, adminAuthenticate, settingCreate);
router.post("/v1/update", authAuthenticate, adminAuthenticate, settingUpdate);
router.post("/v1/getone/:key", authAuthenticate, settingGetOne);
router.post("/v1/getmany", authAuthenticate, adminAuthenticate, settingGetMany);
router.post("/v1/delete/:key", authAuthenticate, adminAuthenticate, settingDelete);

module.exports = router;
