module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeSubscription",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      collectionMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.subscription);
    Index.hasMany(models.stripeSubscriptionItem, {
      onDelete: "cascade",
    });
    Index.hasMany(models.stripeSubscriptionItem, {
      onDelete: "cascade",
    });
    Index.hasMany(models.stripeSubscriptionOp, {
      onDelete: "cascade",
    });
  };

  return Index;
};
