module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeAdmin",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      secretKey: {
        type: Sequelize.STRING,
      },
      publicKey: {
        type: Sequelize.STRING,
      },
      payKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      test: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "activated",
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.hasMany(models.stripeProduct, { onDelete: "cascade" });
    Index.belongsTo(models.admin);
  };

  return Index;
};
