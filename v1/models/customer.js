module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "customer",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      compagnyName: {
        type: Sequelize.STRING,
      },
      gouvId: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      countryCode: {
        type: Sequelize.STRING,
      },
      department: {
        type: Sequelize.STRING,
      },
      region: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      lng: {
        type: Sequelize.FLOAT,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      externalLinkId: {
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
    Index.hasMany(models.subscription, {
      onDelete: "cascade",
    });
    Index.hasMany(models.payment, {
      onDelete: "cascade",
    });
    Index.hasOne(models.stripeCustomer, {
      onDelete: "cascade",
    });
    Index.belongsTo(models.admin);
  };

  return Index;
};
