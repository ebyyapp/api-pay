const _subscription = require("../../functions/stripe/subscription.functions");
const _adminStripe = require("../../functions/stripe/admin.functions");
const _customer = require("../../functions/stripe/customers.functions");
const _operation = require("../../functions/stripe/operations.functions");
const _payment = require("../../functions/stripe/payment.function");

exports.subscription = async (req, res) => {
  const { db, environement } = req;
  const { type } = req.body;
  const { customer } = req.body.data.object;
  const xAccessPay = req.query["x-access-pay"];
  try {
    await _adminStripe.accessPay({ token: xAccessPay }, environement);

    switch (type) {
      case "customer.subscription.created":
        const findCustomer = await db.stripeCustomer.findOne({
          where: {
            id: customer,
          },
        });
        if (!findCustomer) {
          return res.status(404).send({
            err: {
              [customer]: "Id not found",
            },
            error: "Customer Not Found",
          });
        }
        const localSubscription = await _subscription.createLocal(
          {
            customer: findCustomer,
            subscription: req.body.data.object,
          },
          environement
        );
        return res.send(localSubscription?.data || {});

      case "customer.subscription.updated":
        const updateResult = await _subscription.updateLocal(
          {
            subscription: req.body.data.object,
          },
          environement
        );
        return res.send(updateResult?.data || {});
      case "customer.subscription.deleted":
        const deleteResult = await _subscription.updateLocal(
          {
            subscription: req.body.data.object,
          },
          environement
        );
        return res.send(deleteResult?.data || {});
      default:
        return res.send("OK");
    }
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};

exports.customer = async (req, res) => {
  const { db, environement } = req;
  const { type } = req.body;
  const xAccessPay = req.query["x-access-pay"];
  try {
    const { data } = await _adminStripe.accessPay(
      { token: xAccessPay },
      environement
    );
    switch (type) {
      case "customer.created":
        Object.assign(req.body.data.object, { adminId: data.admin.id });
        const createResult = await _customer.create(
          req.body.data.object,
          environement
        );
        return res.send(createResult?.data || {});
      case "customer.updated":
        const updateResult = await _customer.updateLocal(
          req.body.data.object,
          undefined,
          environement
        );
        return res.send(updateResult?.data || {});
      case "customer.deleted":
        const deleteResult = await _customer.updateLocal(
          req.body.data.object,
          "deleted",
          environement
        );
        return res.send(deleteResult?.data || {});
      default:
        return res.send("OK");
    }
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};

exports.invoices = async (req, res) => {
  const { db, environement } = req;
  const { type } = req.body;
  const xAccessPay = req.query["x-access-pay"];
  try {
    const { data } = await _adminStripe.accessPay(
      { token: xAccessPay },
      environement
    );
    const { secretKey } = data;
    switch (type) {
      case "invoice.paid":
        const { payment_intent, subscription, customer } = req.body.data.object;
        const stripe = require("stripe")(secretKey);
        if (payment_intent) {
          const findPayment = await stripe.paymentIntents.retrieve(
            payment_intent
          );
          await _payment.setPayment(findPayment, environement);
        }
        if (subscription && customer) {
          const findSubscription = await stripe.subscriptions.retrieve(
            subscription
          );
          const findCustomer = await db.stripeCustomer.findOne({
            where: {
              id: customer,
            },
          });
          await _subscription.createLocal({
            customer: findCustomer,
            subscription: findSubscription,
          });
        }
        const paid = await _operation.setOperation(
          req.body.data.object,
          "paid",
          environement
        );
        return res.send(paid?.data || {});
      case "invoice.payment_action_required":
        const payment_action_required = await _operation.setOperation(
          req.body,
          "payment_action_required",
          environement
        );
        return res.send(payment_action_required?.data || {});
      case "invoice.payment_failed":
        const payment_failed = await _operation.setOperation(
          req.body,
          "payment_failed",
          environement
        );
        return res.send(payment_failed?.data || {});
      default:
        return res.send("OK");
    }
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
