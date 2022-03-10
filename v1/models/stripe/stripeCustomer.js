module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeCustomer",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.customer);
    Index.hasMany(models.stripePaymentMethod, {
      onDelete: "cascade",
    });
  };

  return Index;
};
