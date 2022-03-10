module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "subscription",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      periodStart: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      periodEnd: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "incomplete",
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.customer);
    Index.hasOne(models.stripeSubscription, {
      onDelete: "cascade",
    });
  };

  return Index;
};
