const axios = require("axios");
const configs = require("../../configs/general.config");
const apiConnect = configs.apis.connect;

const checkToken = ({ token, code }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) {
        return reject({
          status: 401,
          data: {
            err: { "x-access-token": "Is required" },
            error: "Not authorized",
          },
        });
      }
      const response = await axios({
        method: "POST",
        url: `${apiConnect.url}/${apiConnect.fixe}/security/x-access/check`,
        data: {
          token,
          code,
          endpoint: "pay",
        },
      });
      const user = response.data;
      resolve({
        status: 200,
        data: user,
      });
    } catch (err) {
      console.log(err);
      const status = err?.response?.status || err?.status || 500;
      const data = err?.response?.data || err?.data || {};
      reject({
        status,
        data,
      });
    }
  });
};

module.exports = {
  checkToken,
};
