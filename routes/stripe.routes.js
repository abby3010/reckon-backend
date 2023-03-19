const express = require("express");
const { createPaymentIntent } = require("../controller/stripe.controller");
const router = express.Router();

router.post("/buy-with-stripe", createPaymentIntent);

module.exports = router;
