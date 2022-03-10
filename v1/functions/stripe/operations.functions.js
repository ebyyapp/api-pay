const databases = require("../../models");

const setOperation = (invoice, status, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const findOp = await db.stripeSubscriptionOp.findOne({
        where: { invoiceId: invoice.id },
      });
      if (findOp) {
        await db.stripeSubscriptionOp.update(
          {
            status,
          },
          { where: { invoiceId: invoice.id } }
        );
        const newOp = await db.stripeSubscriptionOp.findOne({
          where: { invoiceId: invoice.id },
        });
        resolve({ status: 200, data: newOp });
      } else {
        if (invoice.payment_intent) {
          const findSub = await db.stripeSubscription.findOne({
            where: { id: invoice.subscription },
          });
          if (!findSub) {
            return reject({
              status: 404,
              data: {
                err: {
                  [invoice.subscription]: "Not found",
                },
                error: "Subscription not found",
              },
            });
          }
          const createOp = await db.stripeSubscriptionOp.create({
            invoiceId: invoice.id,
            stripePaymentId: invoice.payment_intent,
            status,
            stripeSubscriptionId: invoice.subscription,
          });
          return resolve({ status: 200, data: createOp });
        } else {
          resolve({ status: 200, data: {} });
        }
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

module.exports = { setOperation };
