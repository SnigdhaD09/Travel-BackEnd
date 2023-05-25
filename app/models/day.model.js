module.exports = (sequelize, Sequelize) => {
    const Day = sequelize.define("day", {
      tripDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  
    return Day;
  };