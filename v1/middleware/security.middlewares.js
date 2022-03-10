const axios = require("axios");
const configs = require("../configs/general.config");
const apiMain = configs.apis.main;
const _access = require("../functions/security/access.function");

exports.accessAPI = async (req, res, next) => {
  const autorization = req.headers.authorization?.split(" ");
  const token = autorization?.[1] || req.query?.authorization;
  if (!token) {
    return res.status(401).json({ err: {}, error: "Not authorized" });
  }
  try {
    const response = await axios({
      method: "POST",
      url: `${apiMain.url}/${apiMain.fixe}/access/check/access`,
      data: {
        token,
      },
    });
    const environement = response.data.environement;
    req.environement = environement;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(err?.response?.status || err?.status || 500)
      .json(err?.response?.data || err?.data || { err, error: "Error Server" });
  }
};

exports.accessUser = (code) => {
  return async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.query["x-access-token"];
    try {
      const user = await _access.checkToken({ token, code });
      req.user = user;
      next();
    } catch (err) {
      res
        .status(err?.response?.status || err?.status || 500)
        .json(
          err?.response?.data || err?.data || { err, error: "Error Server" }
        );
    }
  };
};
