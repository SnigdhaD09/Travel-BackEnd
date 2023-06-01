module.exports = (app) => {
    const Day = require("../controllers/day.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new Day
    router.post("/trips/:tripId/days/", [authenticateRoute], Day.create);

    // Retrieve all Trip Days
    router.get("/trips/:tripId/days", Day.findAllDaysForTrip);
  
    // Retrieve a single Day with id
    router.get("/trips/:tripId/days/:id", Day.findOne);
  
    // Update a Day with id
    router.put("/trips/:tripId/days/:id", [authenticateRoute], Day.update);
  
    // Delete a Day with id
    router.delete("/trips/:tripId/days/:id", [authenticateRoute], Day.delete);
  
    // Delete all days
    router.delete("/trips/:tripId/days/", [authenticateRoute], Day.deleteAll);
  
    app.use("/travelapi", router);
  };
  