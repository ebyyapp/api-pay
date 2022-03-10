const { PropTypes } = require("../../../propstypes");

module.exports = {
  newStripeSubscription: {
    customer: PropTypes().isRequired().isString(),
    prices: PropTypes().isRequired().isArrayOf({
      price: PropTypes().isRequired().isString(),
      quantity: PropTypes().isNumber(),
    }),
  },
};
