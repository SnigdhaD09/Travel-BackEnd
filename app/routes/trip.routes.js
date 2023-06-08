module.exports = (app) => {
  const Trip = require("../controllers/trip.controller.js");
  const { authenticateRoute } = require("../authentication/authentication");
  var router = require("express").Router();

  // Create a new Trip
  router.post("/trips/", [authenticateRoute], Trip.create);

  // Register for a Trip
  router.post("/trips/register", [authenticateRoute], Trip.register);

  // Unregister from a Trip
  router.post("/trips/unregister", [authenticateRoute], Trip.unregister);

  // Retrieve Trip by tripId
  router.get(
    "/trips/:tripId",
    [authenticateRoute],
    Trip.findOne
  );

  // Retrieve all registered Trips
  router.get("/trips/registered/:userId", Trip.findAllRegisteredTrips);

  // Retrieve a single Trip with id
  router.get("/trips/:id", Trip.findOne);

  // Retrieve a single Trip with id
  router.get("/trips", Trip.findAll);

  // Update a Trip with id
  router.put("/trips/:id", [authenticateRoute], Trip.update);

  // Delete a Trip with id
  router.delete("/trips/:id", [authenticateRoute], Trip.delete);

  // Delete all trips
  router.delete("/trips/", [authenticateRoute], Trip.deleteAll);

  app.use("/travelapi", router);
};
