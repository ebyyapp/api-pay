const _admin = require("../../functions/stripe/admin.functions");

exports.accessPay = () => {
  return async (req, res, next) => {
    const token = req.headers?.["x-access-pay"];
    if (!token) {
      return res.status(401).json({
        err: { "x-access-pay": "Is Required" },
        error: "Not authorized",
      });
    }
    try {
      const stripeAmdin = await _admin.accessPay({ token });
      const { data } = stripeAmdin;
      req.stripeAdmin = data;
      next();
    } catch (err) {
      console.log(err);
      res
        .status(err?.status || 500)
        .json(err?.data || { err, error: "Error Server" });
    }
  };
};
