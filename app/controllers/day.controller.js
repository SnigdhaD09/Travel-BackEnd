const db = require("../models");
const Day = db.day;
// Create and Save a new Day
exports.create = (req, res) => {
  // Validate request
  if (req.body.tripDate === undefined) {
    res.status(400).send({
      message: `Trip Date cannot be empty for day!`,
    });
    return;
  } else if (req.body.tripId === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty for day!`,
    });
    return;
  } else if (req.body.hotelId === undefined) {
    res.status(400).send({
      message: `Hotel Id cannot be empty for day!`,
    });
    return;
  } 

  // Create a Day
  const day = {
    tripDate: req.body.tripDate,
    tripId: req.body.tripId,
    hotelId: req.body.hotelId,
  };
  // Save Day in the database
  Day.create(day)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Day.",
      });
    });
};

// Find all Days
exports.findAll = (req, res) => {
  const userId = req.params.userId;
  Day.findAll({
    order: [
      ["tripDate", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Days.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Days.",
      });
    });
};

// Find a single Day with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Day.findOne({
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
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Day with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Day with id=" + id,
      });
    });
};
// Update a Day by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Day.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Day was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Day with id=${id}. Maybe Day was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Day with id=" + id,
      });
    });
};
// Delete a Day with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Day.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Day was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Day with id=${id}. Maybe Day was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Day with id=" + id,
      });
    });
};
// Delete all Days from the database.
exports.deleteAll = (req, res) => {
  Day.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Days were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all days.",
      });
    });
};
