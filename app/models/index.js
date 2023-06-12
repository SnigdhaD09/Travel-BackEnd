const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

db.day = require("./day.model.js")(sequelize, Sequelize);
db.daysite = require("./daysite.model.js")(sequelize, Sequelize);
db.hotel = require("./hotel.model.js")(sequelize, Sequelize);
db.registration = require("./registration.model.js")(sequelize, Sequelize);
db.favorite = require("./favorite.model.js")(sequelize, Sequelize);
db.site = require("./site.model.js")(sequelize, Sequelize);
db.trip = require("./trip.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for trip
db.user.hasMany(
  db.trip,
  { as: "trip" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.trip.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);

// foreign key for days
db.trip.hasMany(
  db.day,
  { as: "day" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.day.belongsTo(
  db.trip,
  { as: "trip" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for sites
db.day.hasMany(
  db.site,
  { as: "site" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.site.belongsTo(
  db.day,
  { as: "day" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign keys for hotels
db.day.belongsTo(
  db.hotel,
  { as: "hotel" },
  { foreignKey: { allowNull: false } }
);

// foreign keys for registrations
db.trip.hasMany(
  db.registration,
  { as: "registration" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.user.hasMany(
  db.registration,
  { as: "registration" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.registration.belongsTo(
  db.trip,
  { as: "trip" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.registration.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
// foreign keys for favorites
db.trip.hasMany(
  db.favorite,
  { as: "favorite" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.user.hasMany(
  db.favorite,
  { as: "favorite" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.favorite.belongsTo(
  db.trip,
  { as: "trip" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.favorite.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign keys for daysites
db.day.hasMany(
  db.daysite,
  { as: "daysite" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.site.hasMany(
  db.daysite,
  { as: "daysite" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.daysite.belongsTo(
  db.day,
  { as: "day" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.daysite.belongsTo(
  db.site,
  { as: "site" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);



module.exports = db;