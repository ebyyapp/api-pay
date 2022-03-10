const create = (body, stripe, environement) => {
  const db = databases[environement];
  return new Promise(async (resolve, reject) => {
    try {
      const {
        productId,
        interval,
        usageType,
        aggregateUsage,
        currency,
        unitAmount,
        tiersMode,
        billingScheme,
        taxBehavior,
        tiers,
      } = body;
      const product = await db.stripeProduct.findOne({
        where: { id: productId },
      });
      let stripeTier,
        stripeTiers = [];
      if (tiers && tiers.length) {
        stripeTiers = tiers.map((tier) => {
          return {
            up_to: tier.upTo,
            unit_amount: tier.unitAmount,
            flat_amount: tier.flatAmount,
          };
        });

        stripeTier = await db.stripeTier.bulkCreate(tiers, {
          returning: true,
        });
      }
      const price = await stripe.prices.create({
        unit_amount: unitAmount,
        billing_scheme: billingScheme,
        tax_behavior: taxBehavior,
        currency,
        recurring: {
          interval,
          usage_type: usageType,
          aggregate_usage: aggregateUsage,
        },
        tiers_mode: tiersMode,
        product: productId,
        tiers: stripeTiers,
      });
      Object.assign(body, { id: price.id });
      const stripePrice = await db.stripePrice.create(body);
      await product.addStripePrice(stripePrice);
      if (stripeTier) {
        await stripePrice.addStripeTiers(stripeTier);
      }

      const newPrice = await db.stripePrice.findOne({
        where: { id: stripePrice.id },
        include: [
          {
            model: db.stripeTier,
          },
        ],
      });
      resolve({
        status: 200,
        data: newPrice,
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

module.exports = { create };
