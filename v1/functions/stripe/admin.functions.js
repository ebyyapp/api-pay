const databases = require("../../models");
const jwt = require("jsonwebtoken");
const secrets = require("../../configs/secret.config");
const CryptoJS = require("crypto-js");
const jwtKey = secrets.payKey;
const cryptoKey = secrets.cryptoStripeKeys;

const accessPay = (body, environement) => {
  const db = databases[environement];
  const { token } = body;
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, jwtKey, async (err, data) => {
        if (!err) {
          try {
            const admin = await db.stripeAdmin.findOne({
              where: { payKey: token, status: "activated" },
              include: db.admin,
            });
            if (admin) {
              const stringtify = JSON.stringify(admin);
              const parse = JSON.parse(stringtify);
              const secretKey = CryptoJS.AES.decrypt(
                admin.secretKey,
                cryptoKey
              ).toString(CryptoJS.enc.Utf8);
              const publicKey = CryptoJS.AES.decrypt(
                admin.publicKey,
                cryptoKey
              ).toString(CryptoJS.enc.Utf8);
              Object.assign(parse, { secretKey, publicKey });
              resolve({
                status: 200,
                data: parse,
              });
            } else {
              reject({
                status: 401,
                data: {
                  err: { "x-access-pay": "Killed" },
                  error: "Not authorized",
                },
              });
            }
          } catch (err) {
            console.log(err);
            reject({
              status: err?.status || 500,
              data: {
                err,
                error: "Error server",
              },
            });
          }
        } else {
          reject({
            status: 498,
            data: {
              err: { "x-access-pay": "Expired" },
              error: "Token expired",
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject({
        status: err?.status || 500,
        data: {
          err,
          error: "Error server",
        },
      });
    }
  });
};

module.exports = {
  accessPay,
};
