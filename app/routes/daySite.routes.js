module.exports = (app) => {
    const DaySite = require("../controllers/daySite.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new DaySite
    router.post("/days/:dayId/daysites", [authenticateRoute], DaySite.create);

    // Retrieve all Trip DaySites
    router.get("/days/:dayId/daysites", DaySite.findAllDaySitesForDay);
  
    // Retrieve a single DaySite with id
    router.get("/days/:dayId/daysites/:id", DaySite.findOne);
  
    // Update a DaySite with id
    router.put("/days/:dayId/daysites/:id", [authenticateRoute], DaySite.update);
  
    // Delete a DaySite with id
    router.delete("/days/:dayId/daysites/:id", [authenticateRoute], DaySite.delete);
  
    // Delete all DaySites
    router.delete("/days/:dayId/daysites/", [authenticateRoute], DaySite.deleteAll);
  
    app.use("/travelapi", router);
  };
  