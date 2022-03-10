module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeSubscriptionItem",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripeSubscription);
    Index.belongsTo(models.stripePrice);
  };

  return Index;
};
