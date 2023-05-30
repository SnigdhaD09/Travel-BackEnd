const db = require("../models");
const Hotel = db.hotel;
const RecipeStep = db.recipeStep;
const RecipeIngredient = db.recipeIngredient;
const Ingredient = db.ingredient;
const Op = db.Sequelize.Op;
// Create and Save a new Hotel
exports.create = (req, res) => {
  // Validate request
  if (req.body.name === undefined) {
    const error = new Error("Name cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.address === undefined) {
    const error = new Error("Address cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.website === undefined) {
    const error = new Error("Website cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.imagelink === undefined) {
    const error = new Error("Image cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.checkinDate === undefined) {
    const error = new Error("Check In Date cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.checkOutDate === undefined) {
    const error = new Error("Check Out Date cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.phoneNumber === undefined) {
    const error = new Error("Phone Number cannot be empty for hotel!");
    error.statusCode = 400;
    throw error;
  }

  // Create a Hotel
  const hotel = {
    name: req.body.name,
    address: req.body.address,
    website: req.body.website,
    imagelink: req.body.imagelink,
    checkinDate: req.body.checkinDate,
    checkOutDate: req.body.checkOutDate,
    phoneNumber: req.body.phoneNumber,
  };
  // Save Hotel in the database
  Hotel.create(hotel)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Hotel.",
      });
    });
};

// Find all Hotels
exports.findAll = (req, res) => {
  const userId = req.params.userId;
  Hotel.findAll({
    order: [
      ["name", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Hotels.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Hotels.",
      });
    });
};

// Find a single Hotel with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Hotel.findOne({
    where: { id: id },
    include: [
      {
        model: RecipeStep,
        as: "recipeStep",
        required: false,
        include: [
          {
            model: RecipeIngredient,
            as: "recipeIngredient",
            required: false,
            include: [
              {
                model: Ingredient,
                as: "ingredient",
                required: false,
              },
            ],
          },
        ],
      },
    ],
    order: [[RecipeStep, "stepNumber", "ASC"]],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Hotel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Hotel with id=" + id,
      });
    });
};
// Update a Hotel by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Hotel.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Hotel was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Hotel with id=${id}. Maybe Hotel was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Hotel with id=" + id,
      });
    });
};
// Delete a Hotel with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Hotel.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Hotel was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Hotel with id=${id}. Maybe Hotel was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Hotel with id=" + id,
      });
    });
};
// Delete all Hotels from the database.
exports.deleteAll = (req, res) => {
  Hotel.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Hotels were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all hotels.",
      });
    });
};
