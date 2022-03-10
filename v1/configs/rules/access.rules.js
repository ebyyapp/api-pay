const { PropTypes } = require("../../../propstypes");

module.exports = {
  newAccess: {
    compagnyName: PropTypes().isRequired().isString(),
    functionalities: PropTypes().isRequired().isArrayOf({
      functionality: PropTypes().isRequired().isString(),
    }),
  },
};
