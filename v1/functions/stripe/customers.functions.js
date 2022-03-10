const databases = require("../../models");
const _utils = require("../../../functions/utils.function");

const create = (stripeCustomer, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const { address, balance, currency } = stripeCustomer;
      const findStripeCustomer = await db.stripeCustomer.findOne({
        where: { id: stripeCustomer.id },
      });

      if (findStripeCustomer) {
        const customer = await db.customer.findOne({
          where: { id: findStripeCustomer.customerId },
          include: db.stripeCustomer,
        });
        return resolve({
          status: 200,
          data: customer,
        });
      }

      if (address) {
        const addressCoordinate = await _utils.getAddressGeoCoding(
          `${address.line1} ${address.postal_code} ${address.city}`
        );
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
        Object.assign(stripeCustomer, addressObject);
      }
      Object.assign(stripeCustomer, { type: "stripe" });

      const stripeCustomerId = stripeCustomer.id;
      delete stripeCustomer.id;

      const customer = await db.customer.create(stripeCustomer);
      await db.stripeCustomer.create({
        id: stripeCustomerId,
        balance,
        currency,
        customerId: customer.id,
      });
      const newCustomerResult = await db.customer.findOne({
        where: { id: customer.id },
        include: [{ model: db.stripeCustomer }],
      });

      resolve({
        status: 200,
        data: newCustomerResult,
      });
    } catch (err) {
      console.log(err);
      reject({
        status: err?.status || err?.statusCode || 500,
        data: {
          err,
          error: "Error server",
        },
      });
    }
  });
};
const updateLocal = (stripeCustomer, status, environement) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = databases[environement];
      const { address, balance, currency } = stripeCustomer;
      const findStripeCustomer = await db.stripeCustomer.findOne({
        where: { id: stripeCustomer.id },
      });
      if (!findStripeCustomer) {
        return reject({
          status: 404,
          data: {
            err: {
              [stripeCustomer.id]: "Not found",
            },
            error: "Customer Not found",
          },
        });
      }

      if (address) {
        const addressCoordinate = await _utils.getAddressGeoCoding(
          `${address.line1} ${address.postal_code} ${address.city}`
        );
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
        Object.assign(stripeCustomer, addressObject);
      }
      Object.assign(stripeCustomer, { status });
      delete stripeCustomer.id;

      await db.customer.update(stripeCustomer, {
        where: {
          id: findStripeCustomer.customerId,
        },
      });

      await db.stripeCustomer.update(
        {
          balance,
          currency,
        },
        {
          where: {
            id: findStripeCustomer.id,
          },
        }
      );
      const newCustomerResult = await db.customer.findOne({
        where: { id: findStripeCustomer.id },
        include: [{ model: db.stripeCustomer }],
      });

      resolve({
        status: 200,
        data: newCustomerResult,
      });
    } catch (err) {
      console.log(err);
      reject({
        status: err?.status || err?.statusCode || 500,
        data: {
          err,
          error: "Error server",
        },
      });
    }
  });
};
const findPaymentMethods = (body, stripe, environement) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { customer, type } = body;
      const paymentMethods = await stripe.customers.listPaymentMethods(
        customer,
        { type: type || "card" }
      );
      const { data } = paymentMethods;
      if (!data.length) {
        return reject({
          status: 400,
          data: {
            err: {
              [customer]: "PaymentMethods not found",
            },
            error: "PaymentMethod Not Found",
          },
        });
      }
      resolve({
        status: 200,
        data: paymentMethods,
      });
    } catch (err) {
      console.log(err);
      reject({
        status: err?.status || err?.statusCode || 500,
        data: {
          err,
          error: "Error server",
        },
      });
    }
  });
};

module.exports = { create, findPaymentMethods, updateLocal };
