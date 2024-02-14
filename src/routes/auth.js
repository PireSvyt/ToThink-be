const express = require("express");
const router = express.Router();

const authSignIn = require("../controllers/auth/authSignIn.js");
const authAssess = require("../controllers/auth/authAssess.js");
const authSendPassword = require("../controllers/auth/authSendPassword.js");
const authPasswordReset = require("../controllers/auth/authPasswordReset.js");

router.post("/v1/signin", authSignIn);
router.post("/v1/assess", authAssess);
router.post("/v1/sendpassword", authSendPassword);
router.post("/v1/passwordreset", authPasswordReset);

module.exports = router;
