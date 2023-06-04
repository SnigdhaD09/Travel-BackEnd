const db = require("../models");
const Day = db.day;
const Site = db.site;
const DaySite = db.daysite;

// Create and Save a new DaySite
exports.create = (req, res) => {
  // Validate request
  if (req.body.dayId === undefined) {
    res.status(400).send({
      message: `Day Id cannot be empty for day!`,
    });
    return;
  } else if (req.body.siteId === undefined) {
    res.status(400).send({
      message: `Site Id cannot be empty for day!`,
    });
    return;
  } 

  // Create a DaySite
  const daySite = {
    dayId: req.params.dayId,
    siteId: req.body.siteId,
  };
  // Save Day in the database
  DaySite.create(daySite)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Day Site.",
      });
    });
};

exports.findAllDaySitesForDay = (req, res) => {
  const dayId = req.params.dayId;
  DaySite.findAll({
    where: { dayId: dayId },
    include: [
      {
        model: Day,
        as: "day",
        required: false,
      },
      {
        model: Site,
        as: "site",
        required: false,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving daysites for a day.",
      });
    });
};


// Find a single DaySite with an id
exports.findOne = (req, res) => {
  const dayId = req.params.dayId;
  const id = req.params.id;
  DaySite.findOne({
    where: { id: id , dayId: dayId},
    include: [
        {
          model: Day,
          as: "day",
          required: false,
        },
        {
          model: Site,
          as: "site",
          required: false,
        },
      ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find DaySite with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving DaySite with id=" + id,
      });
    });
};
// Update a DaySite by the id in the request
exports.update = (req, res) => {
  const dayId = req.params.dayId;
  const id = req.params.id;
  DaySite.update(req.body, {
    where: { id: id , dayId: dayId },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "DaySite was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update DaySite with id=${id}. Maybe DaySite was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating DaySite with id=" + id,
      });
    });
};
// Delete a DaySite with the specified id in the request
exports.delete = (req, res) => {
  const dayId = req.params.dayId;
  const id = req.params.id;
  DaySite.destroy({
    where: { id: id , dayId: dayId },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "DaySite was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete DaySite with id=${id}. Maybe DaySite was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete DaySite with id=" + id,
      });
    });
};
// Delete all DaySites from the database.
exports.deleteAll = (req, res) => {
  const dayId = req.params.dayId;
  DaySite.destroy({
    where: { id: id , dayId: dayId },
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} DaySites were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all daysites for the trip.",
      });
    });
};
