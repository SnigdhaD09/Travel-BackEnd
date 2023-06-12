module.exports = (app) => {
  const Trip = require("../controllers/trip.controller.js");
  const { authenticateRoute } = require("../authentication/authentication");
  var router = require("express").Router();

  // Create a new Trip
  router.post("/trips/", [authenticateRoute], Trip.create);

  // Check if Trip is Favorite
  router.get("/trips/favorite/:userId/:tripId", Trip.checkFavorite);

  // Mark a Trip as Favorite
  router.post("/trips/favorite", [authenticateRoute], Trip.favorite);

  // Mark a Trip as Not Favorite
  router.post("/trips/notfavorite", [authenticateRoute], Trip.notFavorite);

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

  // Share a Trip with id
  router.post("/trips/:id/share", Trip.shareTrip);

  // Copies a Trip with id
  router.get("/trips/:id/copy", Trip.copyTrip);

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
