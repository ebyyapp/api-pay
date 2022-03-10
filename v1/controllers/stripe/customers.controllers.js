const { newCustomer } = require("../../configs/rules/customers.rules");
const { ObjectOf } = require("../../../propstypes");
const _utils = require("../../../functions/utils.function");
const _adminStripe = require("../../functions/stripe/admin.functions");
const _customers = require("../../functions/stripe/customers.functions");

exports.create = async (req, res) => {
  try {
    const { db, environement } = req;
    const result = ObjectOf(req.body, newCustomer);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const {
      address,
      email,
      name,
      description,
      phone,
      externalLinkId,
      compagnyName,
      gouvId,
    } = req.body;
    const oStripe = req.body.stripe;
    const accessPay = oStripe?.accessPay;
    const { data } = await _adminStripe.accessPay(
      { token: accessPay },
      environement
    );
    const { secretKey, admin } = data;

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

    const o = {
      name,
      email,
      description,
      phone: phone,
      address: {
        line1: addressObject.address,
        city: addressObject.city,
        country: addressObject.countryCode,
        postal_code: addressObject.zipCode,
        state: addressObject.region,
      },
    };
    const stripe = require("stripe")(secretKey);
    const stripeCustomer = await stripe.customers.create(o);
    Object.assign(stripeCustomer, {
      externalLinkId,
      compagnyName,
      gouvId,
      adminId: admin.id,
    });
    const newCustomerResult = await _customers.create(
      stripeCustomer,
      environement
    );

    res.send(newCustomerResult.data);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
