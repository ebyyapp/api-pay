module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "stripeProduct",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.stripeAdmin);
    Index.hasMany(models.stripePrice, {
      onDelete: "cascade",
    });
  };

  return Index;
};
