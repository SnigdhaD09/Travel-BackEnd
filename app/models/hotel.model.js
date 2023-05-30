module.exports = (sequelize, Sequelize) => {
    const Hotel = sequelize.define("hotel", {
      hotelName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      website: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      checkinDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      checkoutDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      hotelImage: {
        type: Sequelize.STRING( ),
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  
    return Hotel;
  };