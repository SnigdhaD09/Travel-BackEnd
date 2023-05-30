module.exports = (app) => {
  const Site = require("../controllers/site.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Site
  router.post("/sites/", [authenticateRoute], Site.create);

  // Retrieve all Sites
  router.get("/sites", Site.findAll);

  // Retrieve a single Site with id
  router.get("/sites/:id", Site.findOne);

  // Update a Site with id
  router.put("/sites/:id", [authenticateRoute], Site.update);

  // Delete a Site with id
  router.delete("/sites/:id", [authenticateRoute], Site.delete);

  // Delete all sites
  router.delete("/sites/", [authenticateRoute], Site.deleteAll);

  app.use("/travelapi", router);
};
