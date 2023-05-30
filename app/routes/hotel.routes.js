module.exports = (app) => {
  const Hotel = require("../controllers/hotel.controller.js");
  const { authenticateRoute } = require("../authentication/authentication");
  var router = require("express").Router();

  // Create a new Hotel
  router.post("/hotels/", [authenticateRoute], Hotel.create);

  // Retrieve all Hotels
  router.get("/hotels", Hotel.findAll);

  // Retrieve a single Hotel with id
  router.get("/hotels/:id", Hotel.findOne);

  // Update a Hotel with id
  router.put("/hotels/:id", [authenticateRoute], Hotel.update);

  // Delete a Hotel with id
  router.delete("/hotels/:id", [authenticateRoute], Hotel.delete);

  // Delete all hotels
  router.delete("/hotels/", [authenticateRoute], Hotel.deleteAll);

  app.use("/travelapi", router);
};
