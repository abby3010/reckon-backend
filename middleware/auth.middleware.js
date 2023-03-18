const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
// const User = require("../model/user.model");

exports.verifyuser = async (req, res, next) => {
  const authHeader = req.headers.authtoken;
  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      console.log(user);
      const userData = await userModel.findOne({ _id: user._id });
      console.log(userData);
      if (!userData) {
        return res.status(403).json("User not found!");
      }
      req.user = userData;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};
