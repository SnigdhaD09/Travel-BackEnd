module.exports = (sequelize, Sequelize) => {
    const Site = sequelize.define("site", {
      siteName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      siteDescription: {
        type: Sequelize.STRING,
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
        type: Sequelize.BLOB,
        allowNull: false,
      },
    });
  
    return Site;
  };