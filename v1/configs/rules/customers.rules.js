const { PropTypes } = require("../../../propstypes");

module.exports = {
  newCustomer: {
    name: PropTypes().isRequired().isString(),
    compagnyName: PropTypes().isString(),
    gouvId: PropTypes().isString(),
    address: PropTypes().isRequired().isString(),
    phone: PropTypes().isString(),
    email: PropTypes().isRequired().isString(),
    stripe: PropTypes()
      .isObjectOf({
        accessPay: PropTypes().isString().isRequired(),
      })
      .isRequired(),
  },
};
