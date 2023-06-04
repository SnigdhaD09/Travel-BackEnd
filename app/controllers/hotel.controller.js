const db = require("../models");
const Hotel = db.hotel;
// Create and Save a new Hotel
exports.create = (req, res) => {
  // Validate request
  if (req.body.hotelName === undefined) {
    res.status(400).send({
      message: `Name cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.address === undefined) {
    res.status(400).send({
      message: `Address cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.website === undefined) {
    res.status(400).send({
      message: `Website cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.hotelImage === undefined) {
    res.status(400).send({
      message: `Image cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.checkinDate === undefined) {
    res.status(400).send({
      message: `Check In Date cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.checkoutDate === undefined) {
    res.status(400).send({
      message: `Check Out Date cannot be empty for hotel!`,
    });
    return;
  } else if (req.body.phoneNumber === undefined) {
    res.status(400).send({
      message: `Phone Number cannot be empty for hotel!`,
    });
    return;
  }

  // Create a Hotel
  const hotel = {
    hotelName: req.body.hotelName,
    address: req.body.address,
    website: req.body.website,
    hotelImage: req.body.hotelImage,
    checkinDate: req.body.checkinDate,
    checkoutDate: req.body.checkoutDate,
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
      ["hotelName", "ASC"],
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
