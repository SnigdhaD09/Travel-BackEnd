const db = require("../models");
const Trip = db.trip;
const Registration = db.registration;
const Day = db.day;
const Site = db.site;
const Hotel = db.hotel;
const DaySite = db.daysite;
const Op = db.Sequelize.Op;
// Create and Save a new Trip
exports.create = (req, res) => {
  // Validate request
  if (req.body.tripTitle === undefined) {
    const error = new Error("Title cannot be empty for trip!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.startdate === undefined) {
    const error = new Error("Start Date cannot be empty for trip!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.enddate === undefined) {
    const error = new Error("End Date cannot be empty for trip!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.tripDescription === undefined) {
    const error = new Error("Description cannot be empty for trip!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.tripDestination === undefined) {
    const error = new Error("Destination cannot be empty for trip!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.isArchived === undefined) {
    req.body.isArchived = false;
  } 

  // Create a Trip
  const trip = {
    tripTitle: req.body.tripTitle,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    tripDescription: req.body.tripDescription,
    tripDestination: req.body.tripDestination,
    isArchived: req.body.isArchived,
  };
  // Save Trip in the database
  Trip.create(trip)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Trip.",
      });
    });
};

// Find all Trips
exports.findAll = (req, res) => {
  Trip.findAll({
    include: [
      {
        model: Day,
        as: "day",
        required: false,
        include: [
          {
            model: Hotel,
            as: "hotel",
            required: false,
            include: [
              {
                model: DaySite,
                as: "daysite",
                required: false,
                include: [
                  {
                    model: Site,
                    as: "site",
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      ["tripTitle", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Trips`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Trips",
      });
    });
};

// Find all Regitered Trips
exports.findAllRegisteredTrips = (req, res) => {
  const userId = req.params.userId;
  Registration.findAll({
    where: { userId: userId },
    include: [
      {
        model: Trip,
        as: "trip",
        required: false,
        include: [
          {
            model: Day,
            as: "day",
            required: false,
            include: [
              {
                model: Hotel,
                as: "hotel",
                required: false,
                include: [
                  {
                    model: DaySite,
                    as: "daysite",
                    required: false,
                    include: [
                      {
                        model: Site,
                        as: "site",
                        required: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      [Trip, "tripTitle", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Registered Trips.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Registered Trips.",
      });
    });
};

// Find a single Trip with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Trip.findOne({
    where: { id: id },
    include: [
      {
        model: Day,
        as: "day",
        required: false,
        include: [
          {
            model: Hotel,
            as: "hotel",
            required: false,
            include: [
              {
                model: DaySite,
                as: "daysite",
                required: false,
                include: [
                  {
                    model: Site,
                    as: "site",
                    required: false,
                  },
                ],
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
          message: `Cannot find Trip with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Trip with id=" + id,
      });
    });
};
// Update a Trip by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Trip.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Trip was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Trip with id=${id}. Maybe Trip was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Trip with id=" + id,
      });
    });
};
// Delete a Trip with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Trip.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Trip was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Trip with id=${id}. Maybe Trip was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Trip with id=" + id,
      });
    });
};
// Delete all Trips from the database.
exports.deleteAll = (req, res) => {
  Trip.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Trips were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all trips.",
      });
    });
};
