module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeSubscriptionOp",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      invoiceId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripeSubscription);
    Index.belongsTo(models.stripePayment);
  };

  return Index;
};
