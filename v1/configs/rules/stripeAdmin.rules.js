const { PropTypes } = require("../../../propstypes");

module.exports = {
  newStripeAdmin: {
    compagnyName: PropTypes().isRequired().isString(),
    gouvId: PropTypes().isString(),
    address: PropTypes().isRequired().isString(),
    phone: PropTypes().isRequired().isString(),
    email: PropTypes().isRequired().isString(),
    secretKey: PropTypes().isRequired().isString(),
    publicKey: PropTypes().isRequired().isString(),
  },
};
