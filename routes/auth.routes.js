// const Users = require("../model/user.model");
// const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
// const passport = require("passport");
// const middlewareWrapper = require("cors");
const { verifyuser } = require("../middleware/auth.middleware");
const {
  fetchUserDataByEmail,
  registerController,
  loginController,
} = require("../controller/auth.controller");
// require("../config/passport");

router.get("/current_user", verifyuser, fetchUserDataByEmail);
router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
