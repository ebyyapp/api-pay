const databases = require("../../models");

const createLocal = (payment, environement) => {
  const db = databases[environement];

  return new Promise(async (resolve, reject) => {
    try {
      const {
        id,
        customer,
        amount,
        currency,
        status,
        application_fee_amount,
        capture_method,
        description,
        payment_method,
        source,
        client_secret,
      } = payment;
      const findCustomer = await db.stripeCustomer.findOne({
        where: { id: customer },
      });
      if (!customer) {
        return reject({
          status: 404,
          data: {
            err: {
              [customer]: "Not found",
            },
            error: "Customer not found",
          },
        });
      }
      const createPayment = await db.payment.create({
        amount,
        currency,
        provider: "stripe",
        status,
        customerId: findCustomer.customerId,
      });
      await db.stripePayment.create({
        id,
        fee: application_fee_amount || 0,
        captureMethod: capture_method,
        clientSecret: client_secret,
        description,
        paymentMethod: payment_method || source,
        paymentId: createPayment.id,
      });
      const newPayment = await db.payment.findOne({
        where: { id: createPayment.id },
        include: db.stripePayment,
      });
      resolve({
        status: 200,
        data: newPayment,
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
const updateLocal = (payment, environement) => {
  const db = databases[environement];

  return new Promise(async (resolve, reject) => {
    try {
      const {
        id,
        status,
        application_fee_amount,
        description,
        payment_method,
        source,
      } = payment;
      const findStripePayment = await db.stripePayment.findOne({
        where: { id },
      });
      if (!findStripePayment) {
        return reject({
          status: 404,
          data: {
            err: {
              [id]: "Not found",
            },
            error: "Payment not found",
          },
        });
      }
      await db.payment.update(
        {
          status,
        },
        {
          where: {
            id: findStripePayment.paymentId,
          },
        }
      );
      await db.stripePayment.update(
        {
          fee: application_fee_amount || 0,
          description,
          paymentMethod: payment_method || source,
        },
        {
          where: {
            id: findStripePayment.id,
          },
        }
      );
      const newPayment = await db.payment.findOne({
        where: { id: findStripePayment.paymentId },
        include: db.stripePayment,
      });
      resolve({
        status: 200,
        data: newPayment,
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
const setPayment = (payment, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = payment;
      const findStripePayment = await db.stripePayment.findOne({
        where: { id },
      });
      if (findStripePayment) {
        const updatePayment = await updateLocal(payment, environement);
        resolve({
          status: 200,
          data: updatePayment,
        });
      } else {
        const createPayment = await createLocal(payment, environement);
        resolve({
          status: 200,
          data: createPayment,
        });
      }
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

module.exports = { setPayment, createLocal, updateLocal };
