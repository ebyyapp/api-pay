const { newStripeAdmin } = require("../../configs/rules/stripeAdmin.rules");
const { ObjectOf } = require("../../../propstypes");
const _utils = require("../../../functions/utils.function");
const CryptoJS = require("crypto-js");
const secrets = require("../../configs/secret.config");
const cryptoKey = secrets.cryptoStripeKeys;
const signPayKey = secrets.payKey;
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { db, environement } = req;
  try {
    const { address, secretKey, publicKey, compagnyName } = req.body;
    const result = ObjectOf(req.body, newStripeAdmin);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const addressCoordinate = await _utils.getAddressGeoCoding(address);
    const addressFields = addressCoordinate[0];
    const addressObject = {
      address: `${addressFields.streetNumber} ${addressFields.streetName}`,
      zipCode: addressFields.zipcode,
      city: addressFields.city,
      country: addressFields.country,
      countryCode: addressFields.countryCode,
      department: addressFields.administrativeLevels.level2long,
      region: addressFields.administrativeLevels.level1long,
      lat: addressFields.latitude,
      lng: addressFields.longitude,
    };
    Object.assign(req.body, addressObject);
    const cryptoSK = CryptoJS.AES.encrypt(secretKey, cryptoKey).toString();
    const cryptoPK = CryptoJS.AES.encrypt(publicKey, cryptoKey).toString();
    const payKey = jwt.sign({ compagnyName }, signPayKey);
    Object.assign(req.body, {
      secretKey: cryptoSK,
      publicKey: cryptoPK,
      payKey,
    });
    const admin = await db.stripeAdmin.create(req.body);
    res.send(admin);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
