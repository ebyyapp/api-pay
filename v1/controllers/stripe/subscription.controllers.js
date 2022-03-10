const {
  newStripeSubscription,
} = require("../../configs/rules/stripeSubscription.rules");
const { ObjectOf } = require("../../../propstypes");
const { Op } = require("sequelize");
const _customer = require("../../functions/stripe/customers.functions");
const _subscription = require("../../functions/stripe/subscription.functions");

exports.create = async (req, res) => {
  const { db, environement } = req;
  try {
    const result = ObjectOf(req.body, newStripeSubscription);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { customer, prices } = req.body;
    const { secretKey, admin } = req.stripeAdmin;
    const findCustomer = await db.stripeCustomer.findOne({
      where: {
        [Op.or]: [
          {
            customerId: customer,
          },
          {
            id: customer,
          },
        ],
      },
      include: [{ model: db.customer, where: { adminId: admin.id } }],
    });
    if (!findCustomer) {
      return res.status(404).send({
        err: {
          [customer]: "Id not found",
        },
        error: "Customer Not Found",
      });
    }

    const stripe = require("stripe")(secretKey);
    const paymentMethods = await _customer.findPaymentMethods(
      { customer },
      stripe,
      environement
    );
    const subscription = await stripe.subscriptions.create({
      customer: customer,
      items: prices,
    });
    const resultStripeSubscription = await _subscription.createLocal(
      {
        customer: findCustomer,
        subscription,
        adminId: admin.id,
      },
      environement
    );
    res.send(resultStripeSubscription.data);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
