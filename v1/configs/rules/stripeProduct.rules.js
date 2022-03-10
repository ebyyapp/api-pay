const { PropTypes } = require("../../../propstypes");

module.exports = {
  newStripeProduct: {
    name: PropTypes().isRequired().isString(),
    description: PropTypes().isString(),
    prices: PropTypes()
      .isArray()
      .isArrayOf({
        interval: PropTypes().isRequired().isString(),
        usageType: PropTypes().oneOf(["licensed", "metered"]),
        aggregateUsage: PropTypes().oneOf([
          "sum",
          "last_during_period",
          "last_ever",
          "max",
        ]),
        currency: PropTypes().isRequired().oneOf(["eur"]),
        billingScheme: PropTypes().isRequired().oneOf(["tiered", "per_unit"]),
        taxBehavior: PropTypes()
          .isRequired()
          .oneOf(["inclusive", "exclusive", "unspecified"]),
        unitAmount: PropTypes().isNumber(),
        tiersMode: PropTypes().oneOf([
          "graduated",
          "standard",
          "package",
          "volume",
        ]),
        tiers: PropTypes().isArray().isArrayOf({
          upTo: PropTypes().isRequired().isString(),
          unitAmount: PropTypes().isRequired().isNumber(),
          flatAmount: PropTypes().isRequired().isNumber(),
        }),
      }),
  },
};
