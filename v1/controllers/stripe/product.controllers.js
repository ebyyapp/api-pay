const { newStripeProduct } = require("../../configs/rules/stripeProduct.rules");
const { ObjectOf } = require("../../../propstypes");
const _prices = require("../../functions/stripe/prices.functions");

exports.create = async (req, res) => {
  const { db, environement } = req;
  try {
    const result = ObjectOf(req.body, newStripeProduct);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { secretKey } = req.stripeAdmin;
    const { name, prices } = req.body;
    const stripe = require("stripe")(secretKey);
    const stripeProduct = await stripe.products.create({
      name,
    });
    const product = await db.stripeProduct.create(stripeProduct);
    const admin = await db.stripeAdmin.findOne({
      where: { id: req.stripeAdmin.id },
    });
    await admin.addStripeProduct(product);

    let errorsPrices = [];

    if (prices && prices.length) {
      errorsPrices = prices.map(async (price) => {
        Object.assign(price, { productId: product.id });
        try {
          return await _prices.create(price, stripe, environement);
        } catch (error) {
          return error;
        }
      });
    }
    errorsPrices = await Promise.all(errorsPrices);
    const createResult = await db.stripeProduct.findOne({
      where: { id: product.id },
      include: [
        {
          model: db.stripeAdmin,
        },
        {
          model: db.stripePrice,
          include: db.stripeTier,
        },
      ],
    });
    res.send({
      product: createResult,
      errors: {
        price: errorsPrices.filter((el) => el.status !== 200),
      },
    });
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
