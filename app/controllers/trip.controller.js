const db = require("../models");
const EmailController = require("./email.controller.js");
const Trip = db.trip;
const Registration = db.registration;
const Favorite = db.favorite;
const User = db.user;
const Day = db.day;
const Site = db.site;
const Hotel = db.hotel;
const DaySite = db.daysite;
const Op = db.Sequelize.Op;
// Create and Save a new Trip
exports.create = (req, res) => {
  // Validate request
  if (req.body.tripTitle === undefined) {
    res.status(400).send({
      message: `Title cannot be empty for trip!`,
    });
    return;
  } else if (req.body.startdate === undefined) {
    res.status(400).send({
      message: `Start Date cannot be empty for trip!`,
    });
    return;
  } else if (req.body.enddate === undefined) {
    res.status(400).send({
      message: `End Date cannot be empty for trip!`,
    });
    return;
  } else if (req.body.tripDescription === undefined) {
    res.status(400).send({
      message: `Description cannot be empty for trip!`,
    });
    return;
  } else if (req.body.tripDestination === undefined) {
    res.status(400).send({
      message: `Destination cannot be empty for trip!`,
    });
    return;
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

function copyTripActual(req, res, id, newId){
  var tripCounter = 0;
  var dayCounter = 0;
  var daySiteCounter = 0;
  var trip = {};
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
          },
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
  })
    .then((data) => {
      if (data) {
        trip = data.dataValues;
        trip.id = undefined;
        Trip.create(trip)
          .then((tripData) => {
            trip.id = tripData.dataValues.id;
            var newTripId = trip.id;
            newId.id = newTripId;
            for(let i=0; i< trip.day.length; i++){
              let tripDay = trip.day[i].dataValues;
              tripDay.id = undefined;
              tripDay.tripId = newTripId;
              Day.create(tripDay)
              .then((dayData)=> {
                var dayId = dayData.dataValues.id;
                for(let j = 0; j< trip.day[i].daysite.length; j++){
                  let daySite = trip.day[i].daysite[j].dataValues;
                  daySite.dayId = dayId;
                  daySite.id = undefined;
                  DaySite.create(daySite)
                    .then((daySiteData)=> {
                    }) 
                }
              }) 
            }
            tripCounter++;
            if(tripCounter == 1 && dayCounter == 0 && dayCounter == 0){
              res.send({
                id: newTripId,
                message: "Copied Trip!",
              });
            }
            return newTripId;
          })
      } else {
        res.status(404).send({
          message: `Cannot find Trip with id=${id}.`,
        });
      }
    });
}

exports.copyTrip = (req, res) => {
  var id = req.params.id;
  if (id === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  }
  var newId = {};
  copyTripActual(req, res, id, newId);  
};

exports.shareTrip = (req, res) => {
  var id = req.params.id;
  if (id === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  }
  var to = req.body.email;
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
          },
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
  })
    .then((data) => {
      if (data) {
        var trip = data.dataValues;
        var sub = "Sharing a Trip";
        var body = `
Hi there,
<br>
A friend has shared this trip with you. Here's the details:
<br><br>
<table style="padding:25px">
<tbody>
<tr><td>Trip Name:</td><td>${trip.tripTitle}</td></tr>
<tr><td>Start Date:</td><td>${new Date(trip.startdate).toLocaleDateString()}</td></tr>
<tr><td>End Date:</td><td>${new Date(trip.enddate).toLocaleDateString()}</td></tr>
<tr><td>Trip Desription:</td><td>${trip.tripDescription}</td></tr>
<tr><td>Trip Destination:</td><td>${trip.tripDestination}</td></tr>
</tbody></table>
<br><br>
Please <a href="${process.env.FRONTEND_URL}">visit us</a> to learn more.
<br><br>
Best,<br>
The Trip System<br>
        `;

        EmailController.triggerSend(to, sub, body);
        res.send({
          message: "Shared Trip with " + to,
        });
      } else {
        res.status(404).send({
          message: `Cannot find Trip with id=${id}.`,
        });
      }
    });
};

// Mark a Trip as Favorite
exports.favorite = (req, res) => {
  // Validate request
  if (req.body.tripId === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  } else if (req.body.userId === undefined) {
    res.status(400).send({
      message: `User cannot be empty!`,
    });
    return;
  } 

  // Create a favorite
  const favorite = {
    tripId: req.body.tripId,
    userId: req.body.userId,
  };
  // Save favorite in the database
  Favorite.create(favorite)
    .then((data) => {
      res.send({
        message: "Trip was marked favorite successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while marking the trip as favorite.",
      });
    });
};

// Mark a Trip as Not Favorite
exports.notFavorite = (req, res) => {
  // Validate request
  if (req.body.tripId === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  } else if (req.body.userId === undefined) {
    res.status(400).send({
      message: `User cannot be empty!`,
    });
    return;
  }

  const tripId = req.body.tripId;
  const userId = req.body.userId;
  // Delete favorite in the database
  Favorite.destroy({
    where: {userId: userId, tripId: tripId}
  })
    .then((number) => {
      res.send({
        message: "Trip was marked not favorite successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while marking trip as not favorite.",
      });
    });
};

// Check if a Trip is Favorite
exports.checkFavorite = (req, res) => {
  // Validate request
  const tripId = req.params.tripId;
  const userId = req.params.userId;
  Favorite.findOne({
    where: { tripId: tripId, userId: userId },
  })
    .then((data) => {
      var result = false;
      console.log(data);
      if(data !== null){
        result = true;
      }
      res.send(result);      
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Trip with id=" + tripId,
      });
    });
};


// Register for a Trip
exports.register = (req, res) => {
  // Validate request
  if (req.body.tripId === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  } else if (req.body.userId === undefined) {
    res.status(400).send({
      message: `User cannot be empty!`,
    });
    return;
  } 

  // Create a registration
  const registration = {
    tripId: req.body.tripId,
    userId: req.body.userId,
  };
  // Save registration in the database
  Registration.create(registration)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while registering for the Trip.",
      });
    });
};

// Unregister from a Trip
exports.unregister = (req, res) => {
  // Validate request
  if (req.body.tripId === undefined) {
    res.status(400).send({
      message: `Trip Id cannot be empty!`,
    });
    return;
  } else if (req.body.userId === undefined) {
    res.status(400).send({
      message: `User cannot be empty!`,
    });
    return;
  }

  const tripId = req.body.tripId;
  const userId = req.body.userId;
  // Delete registration in the database
  Registration.destroy({
    where: {userId: userId, tripId: tripId}
  })
    .then((number) => {
      res.send({
        message: "Trip was unregistered successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while unregistering from the Trip.",
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
          },
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
              },
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
  const id = req.params.tripId;
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
          },
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
        console.log("Sending email -------------------------------------");
        Registration.findAll({
          where: { tripId: id },
          include: [
            {
              model: User,
              as: "user",
              required: false,
            }
          ]
        }).then((data)=> {
          var registrations = data.map(r => {return r.dataValues});
          var users = registrations.map(r=> {return r.user});
          // var userEmails = users.map(u => {return {"email": u.email}});
          // userEmails[1] = {"email": "vinod.modukuri@eagles.oc.edu"};
          var userEmails = users.map(u => {return u.email});

          var sub = "Trip System Update";
          var body = `
Hi there,
<br>
A trip you have registered for has been updated. Here's the new details:
<br><br>
<table style="padding:25px">
<tbody>
<tr><td>Trip Name:</td><td>${req.body.tripTitle}</td></tr>
<tr><td>Start Date:</td><td>${req.body.startdate}</td></tr>
<tr><td>End Date:</td><td>${req.body.enddate}</td></tr>
<tr><td>Trip Desription:</td><td>${req.body.tripDescription}</td></tr>
<tr><td>Trip Destination:</td><td>${req.body.tripDestination}</td></tr>
<tr><td>Archived:</td><td>${req.body.isArchived ? "Yes": "No"}</td></tr>
</tbody></table>
<br><br>
Please <a href="${process.env.FRONTEND_URL}">visit us</a> to learn more.
<br><br>
Best,<br>
The Trip System<br>
          `;
          console.log(userEmails);
          // var personalizationsArray = [{"to": userEmails, "subject": sub}];
          // var personalizations = personalizationsArray;
          // console.log(personalizations);
          // EmailController.triggerSendPersonalized(personalizations, body);
          for(let i=0; i< userEmails.length; i++){
            EmailController.triggerSend(userEmails[i], sub, body);            
          }
        });
       
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
