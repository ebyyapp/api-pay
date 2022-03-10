module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "admin",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      compagnyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gouvId: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
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
    Index.hasOne(models.stripeAdmin, {
      onDelete: "cascade",
    });
    Index.hasMany(models.customer, { onDelete: "cascade" });
  };

  return Index;
};
