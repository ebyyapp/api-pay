const databases = require("../../models");

const findSubscription = async (id, environement) => {
  const db = databases[environement];
  return await db.subscription.findOne({
    where: { id },
    include: [
      {
        model: db.customer,
        include: db.stripeCustomer,
      },
      {
        model: db.stripeSubscription,
        include: [
          { model: db.stripeSubscriptionItem, include: db.stripePrice },
        ],
      },
    ],
  });
};

const createLocal = (props, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const { customer, subscription } = props;
      const periodStart = moment.unix(subscription.current_period_start);
      const periodEnd = moment
        .unix(subscription.current_period_end)
        .add(2, "days");
      const find = await db.stripeSubscription.findOne({
        where: { id: subscription.id },
      });
      if (find) {
        const result = await findSubscription(
          find.subscriptionId,
          environement
        );
        return resolve({
          status: 200,
          data: result,
        });
      }
      const localSubscription = await db.subscription.create({
        periodStart,
        periodEnd,
        provider: "stripe",
        status: subscription.status,
        customerId: customer.customerId,
      });
      const stripeSubscription = await db.stripeSubscription.create({
        id: subscription.id,
        collectionMethod: subscription.collection_method,
        subscriptionId: localSubscription.id,
      });
      const { data } = subscription.items;
      const __items = data.map(async (item) => {
        try {
          await db.stripeSubscriptionItem.create({
            id: item.id,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: item.price.id,
          });
          return {
            status: 200,
          };
        } catch (err) {
          return {
            status: 400,
            data: {
              id: item.id,
              priceId: item.price.id,
            },
          };
        }
      });
      const ssiErrors = await Promise.all(__items);
      const resultStripeSubscription = await await findSubscription(
        localSubscription.id,
        environement
      );
      resolve({
        status: 200,
        data: resultStripeSubscription,
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

const updateLocal = (props, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const { subscription } = props;
      const periodStart = moment.unix(subscription.current_period_start);
      const periodEnd = moment
        .unix(subscription.current_period_end)
        .add(2, "days");
      const find = await db.stripeSubscription.findOne({
        where: { id: subscription.id },
      });
      if (!find) {
        return reject({
          status: 404,
          data: {
            err: {
              [subscription.id]: "Not found",
            },
            error: "Subscription Not found",
          },
        });
      }
      await db.subscription.update(
        {
          periodStart,
          periodEnd,
          status: subscription.status,
        },
        {
          where: {
            id: find.subscriptionId,
          },
        }
      );
      const resultStripeSubscription = await await findSubscription(
        find.subscriptionId,
        environement
      );
      resolve({
        status: 200,
        data: resultStripeSubscription,
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

module.exports = { createLocal, updateLocal };
