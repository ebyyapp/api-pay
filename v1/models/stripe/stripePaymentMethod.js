module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripePaymentMethod",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      country: {
        type: Sequelize.STRING,
      },
      expMonth: {
        type: Sequelize.INTEGER,
      },
      expYear: {
        type: Sequelize.INTEGER,
      },
      last4: {
        type: Sequelize.STRING,
      },
      funding: {
        type: Sequelize.STRING,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripeCustomer);
  };

  return Index;
};
