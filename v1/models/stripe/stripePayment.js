module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripePayment",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fee: {
        type: Sequelize.INTEGER,
      },
      captureMethod: {
        type: Sequelize.INTEGER,
      },
      clientSecret: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.payment);
    Index.hasOne(models.stripeSubscriptionOp, {
      onDelete: "cascade",
    });
  };

  return Index;
};
