module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeTier",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      upTo: {
        type: Sequelize.STRING,
        defaultValue: "inf",
      },
      unitAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      flatAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripePrice);
  };

  return Index;
};
