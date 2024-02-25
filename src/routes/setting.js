const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
//const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticateOwner = require("../controllers/auth/authAuthenticateOwner.js");

const settingCreate = require("../controllers/setting/settingCreate.js");
const settingUpdate = require("../controllers/setting/settingUpdate.js");
const settingGetOne = require("../controllers/setting/settingGetOne.js");
const settingGetMany = require("../controllers/setting/settingGetMany.js");
const settingDelete = require("../controllers/setting/settingDelete.js");

router.post("/v1/create", authAuthenticate, settingCreate);
router.post("/v1/update", authAuthenticate, authAuthenticateOwner, settingUpdate);
router.post("/v1/getone", authAuthenticate, authAuthenticateOwner, settingGetOne);
router.post("/v1/getmany", authAuthenticate, settingGetMany);
router.post("/v1/delete", authAuthenticate, authAuthenticateOwner, settingDelete);

module.exports = router;
