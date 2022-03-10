module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripePrice",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      interval: {
        type: Sequelize.CHAR,
      },
      usageType: {
        type: Sequelize.CHAR, //Mesure de la consomation (metered)
      },
      aggregateUsage: {
        type: Sequelize.CHAR, // Facturer à la consomation selon (sum)
      },
      currency: {
        type: Sequelize.CHAR,
      },
      unitAmount: {
        type: Sequelize.INTEGER, //Tarif
      },
      tiersMode: {
        type: Sequelize.CHAR, //Modèle tarifaire (graduated)
      },
      billingScheme: {
        type: Sequelize.CHAR, //tiered, per_unit
      },
      taxBehavior: {
        type: Sequelize.CHAR,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripeProduct);
    Index.hasMany(models.stripeTier, {
      onDelete: "cascade",
    });
    Index.hasMany(models.stripeSubscriptionItem, {
      onDelete: "cascade",
    });
  };

  return Index;
};
