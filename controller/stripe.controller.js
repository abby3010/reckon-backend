const User = require("../model/user.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// to create a payment intent object in db using stripe
exports.createPaymentIntent = async (req, res) => {
    const { totalAmount } = req.body;
  
    let finalAmount = totalAmount * 100;
  
    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "inr",
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
      payable: finalAmount,
    });
};
