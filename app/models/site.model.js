module.exports = (sequelize, Sequelize) => {
  const Site = sequelize.define("site", {
    siteName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    siteDescription: {
      type: Sequelize.STRING(3000),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    siteImage: {
      type: Sequelize.STRING(3000),
      allowNull: false,
    },
  });

  return Site;
};