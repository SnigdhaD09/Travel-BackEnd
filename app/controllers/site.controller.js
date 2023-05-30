const db = require("../models");
const Site = db.site;
const Op = db.Sequelize.Op;
// Create and Save a new Site
exports.create = (req, res) => {
  // Validate request
  if (req.body.siteName === undefined) {
    res.status(404).send({
        message: `Site name cannot be empty for site!`,
      });return;
  } else if (req.body.siteDescription === undefined) {
    res.status(404).send({
        message: `Description cannot be empty for site!`,
      });return;
  } else if (req.body.state === undefined) {
    res.status(404).send({
        message: `State cannot be empty for site!`,
      });return;
  } else if (req.body.city === undefined) {
    res.status(404).send({
        message: `City be empty for site!`,
      });return;
  } else if (req.body.siteImage === undefined) {
    res.status(404).send({
        message: `Site Image cannot be empty for site!`,
      });return;
  }

  // Create a Site
  const site = {
    siteName: req.body.siteName,
    siteDescription: req.body.siteDescription,
    state: req.body.state,
    city: req.body.city,
    siteImage: req.body.siteImage,
  };
  // Save Site in the database
  Site.create(site)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Site.",
      });
    });
};

// Find all Sites
exports.findAll = (req, res) => {
  Site.findAll({
    order: [
      ["city", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Sites.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Sites.",
      });
    });
};

// Find a single Site with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Site.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Site with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Site with id=" + id,
      });
    });
};
// Update a Site by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Site.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Site was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Site with id=${id}. Maybe Site was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Site with id=" + id,
      });
    });
};
// Delete a Site with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Site.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Site was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Site with id=${id}. Maybe Site was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Site with id=" + id,
      });
    });
};
// Delete all Sites from the database.
exports.deleteAll = (req, res) => {
  Site.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Sites were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sites.",
      });
    });
};
