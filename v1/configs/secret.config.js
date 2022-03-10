require("dotenv").config();

module.exports = {
  accessKey: process.env.ACCESS_JWT_KEY,
  cryptoStripeKeys: process.env.CRYPTO_STRIPE_KEY,
  payKey: process.env.PAY_KEY,
};
