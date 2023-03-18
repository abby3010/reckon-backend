const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../modal/user.modal");

exports.registerController = (req, res) => {
  const { name, email, password, walletAddress, balance } = req.body;
  console.log(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }

  User.findOne({
    email: email,
  }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        email,
        walletAddress,
        balance: parseInt(balance) / 1000000000000000000,
        password: hashed_password,
      });
      console.log(user);
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Some error occured! Please try again" + err,
          });
        } else {
          const token = jwt.sign(
            {
              _id: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          res.cookie("jwt", token);
          return res.status(200).json({
            success: true,
            user,
            token,
            message: "Register Success! Please Login now to continue.",
          });
        }
      });
    }
  });

};

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email: email,
    }).exec(async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User does not exists. Please register",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const { _id, name, email } = user;
      res.cookie("jwt", token);
      return res.json({
        token,
        user: {
          _id,
          name,
          email,
        },
      });
    });
  }
};

exports.fetchUserDataByEmail = async (req, res) => {
  // req.user contains the user id stored from in the session cookie
  console.log(req.body);
  // const { email } = req.user;
  console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu" + req.user);
  await User.findOne({
    email: req.user.email,
  }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "User does not exists. Please register",
      });
    }
    console.log("andar walaa " + user);
    return res.status(200).json({
      message: "User is fetch successfully!",
      success: true,
      user: user,
    });
  });
};
