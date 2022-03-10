const databases = require("../models");

exports.switch = async (req, res, next) => {
  try {
    const environement = req.environement || req.params.env;
    if (!environement) {
      return res.status(400).send({ err: {}, error: "environement required" });
    }
    const db = databases[environement];
    req.db = db;
    next();
  } catch (err) {
    res.status(err?.status || 500).send(
      err?.data || {
        err,
        error: "Error Server",
      }
    );
  }
};
