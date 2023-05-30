module.exports = (sequelize, Sequelize) => {
    const Trip = sequelize.define("trip", {
      tripTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      enddate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tripDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tripDestination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isArchived: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    });
  
    return Trip;
  };  