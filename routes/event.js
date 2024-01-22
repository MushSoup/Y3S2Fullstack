const express = require("express");
const User = require("../models/User");
const Attendee = require("../models/Attendee");
const EventImage = require("../models/EventImage");
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require("moment");
const Event = require("../models/Event");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const ensureAuthenticated = require("../helpers/auth");

router.use(cookieParser());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

//Event Card Page
//Event Card Page
router.get("/readEvent", (req, res) => {
  Event.findAll({
    order: [["eventName", "ASC"]],
    raw: true,
  })
    .then((event) => {
      if (req.user) {
        const userEvents = event.filter(
          (event) => event.eventCreator === req.user.username
        );
        const otherEvents = event.filter(
          (event) =>
            event.eventCreator !== req.user.username || !event.eventCreator
        );
        event.forEach((event) => {
          if (event.eventImg) {
            event.eventImg = event.eventImg.toString("base64");
          }
        });
        Attendee.findOne({
          where: req.params.eventID,
          where: req.user.userID,
        })
          .then((attendee) => {
            const registeredUser = attendee ? attendee : null;

            res.render("event/readEvent", {
              event: event,
              userEvents: userEvents,
              otherEvents: otherEvents,
              registeredUser: registeredUser,
              user: req.user ? req.user.username : null
            });
          })
          .catch((err) => console.log(err));
      } else {
        const otherEvents = event;
        event.forEach((event) => {
          if (event.eventImg) {
            event.eventImg = event.eventImg.toString("base64");
          }
        });
        res.render("event/readEvent", {
          event: event,
          otherEvents: otherEvents,
        });
      }
    })
    .catch((err) => console.log(err));
});

//Create Event
router.get("/showCreateEvent", (req, res) => {
  res.render("event/createEvent");
});

// Adds new event
router.post(
  "/createEvent",
  ensureAuthenticated,
  upload.array("eventImages", 5),
  (req, res) => {
    let eventName = req.body.eventName;
    let eventDesc = req.body.eventDescription;
    let eventLocation = req.body.eventLocation;
    let eventDate = moment(req.body.eventDate, "DD/MM/YYYY");
    let eventCreator = req.user.username;

    // Access the uploaded file from req.file
    let eventImages = req.files.map((file) => ({ image: file.buffer }));

    let eventImg = eventImages[0].image;
    let remainingImages = eventImages.slice(1);

    // Multi-value components return array of strings or undefined
    Event.create(
      {
        eventName,
        eventDate,
        eventDesc,
        eventLocation,
        eventCreator,
        eventImg,
        images: remainingImages,
      },
      {
        include: "images",
      }
    )
      .then((event) => {
        res.redirect("/event/readEvent");
      })
      .catch((err) => console.log(err));
  }
);

//Event Registration Form
router.get("/registerEvent/:eventID", (req, res) => {
  Event.findOne({
    where: {
      eventID: req.params.eventID,
    },
    raw: true,
    nest: true,
  })
    .then((event) => {
      if (req.user) {
        if (req.user.DOB != null) {
          const dob = new Date(req.user.DOB);
          const today = new Date();
          const caclAge = Math.trunc(
            (today - dob) / (365.25 * 24 * 60 * 60 * 1000)
          );
          res.render("event/registerEvent", {
            event: event,
            aName: req.user.username,
            aPhoneNo: req.user.tel,
            aGender: req.user.gender,
            aAge: caclAge,
          });
        } else {
          res.render("event/registerEvent", {
            event: event,
            aName: req.user.username,
            aPhoneNo: req.user.tel,
            aGender: req.user.gender,
            aAge: null,
          });
        }
      } else {
        res.render("event/registerEvent", {
          event: event,
        });
      }
      if (event.eventImg) {
        event.eventImg = event.eventImg.toString("base64");
      }
    })
    .catch((err) => console.log(err));
});

router.post("/registerEvent/:eventID", (req, res) => {
  let aName = req.body.aName;
  let aPhoneNo = req.body.aPhoneNo;
  let aAge = req.body.aAge;
  let aGender = req.body.aGender;
  let aDiet = req.body.aDiet;
  let aEmerCont = req.body.aEmerCont;
  let aExtra = req.body.aExtra;
  let eventID = req.params.eventID;
  let userID = req.user ? req.user.userID : null;

  if (req.user) {
    Attendee.create({
      aName,
      aPhoneNo,
      aAge,
      aGender,
      aDiet,
      aEmerCont,
      aExtra,
      eventID,
      userID,
    })
      .then((attendee) => {
        res.redirect("/event/readEvent");
      })
      .catch((err) => console.log(err));
  } else {
    Attendee.create({
      aName,
      aPhoneNo,
      aAge,
      aGender,
      aDiet,
      aEmerCont,
      aExtra,
      eventID,
    })
      .then((attendee) => {
        res.redirect("/event/readEvent");
      })
      .catch((err) => console.log(err));
  }
});

router.get("/expandedEvent/:eventID", (req, res) => {
  console.log("In edit, id=", req.params.eventID);
  Event.findOne({
    where: {
      eventID: req.params.eventID,
    },

    raw: true,
    nest: true,
  })
    .then((event) => {
      if (event.eventImg) {
        event.eventImg = event.eventImg.toString("base64");
      }

      EventImage.findAll({
        where: {
          eventId: req.params.eventID,
        },
      })
        .then((images) => {
          event.imageSet = images.map((img) => img.image.toString("base64"));
          if (req.user) {
            let viewAttendee = event.eventCreator === req.user.username;
            Attendee.findOne({
              where: {
                eventId:req.params.eventID, 
                userID: req.user.userID
            },
            raw: true,
            nest: true,
            })
              .then((attendee) => {
                
                res.render("event/expandedEvent", {
                  event: event,
                  viewAttendee: viewAttendee,
                  eventID: event.eventID,
                  attendee: attendee,
                });
              })
              .catch((err) => console.log(err));
          } else {
            res.render("event/expandedEvent", {
              event: event,
              eventID: event.eventID,
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/editEvent/:eventID", ensureAuthenticated, (req, res) => {
  console.log("In edit, id=", req.params.eventID);
  Event.findOne({
    where: {
      eventID: req.params.eventID,
    },

    raw: true,
    nest: true,
  })
    .then((event) => {
      if (req.user.id === event.userId) {
        if (event.eventImg) {
          event.eventImg = event.eventImg.toString("base64");
        }
        EventImage.findAll({
          where: {
            eventId: req.params.eventID,
          },
        })
          .then((images) => {
            event.imageSet = images.map((img) => img.image.toString("base64"));
            res.render("event/editEvent", {
              event: event,
            });
          })
          .catch((err) => console.log(err));
      } else {
        console.log("Unauthorised access to event");
        req.flash("error_msg", "Unauthorised access to event");
        res.redirect("/logout");
      }
    })
    .catch((err) => console.log(err));
});

router.put(
  "/saveEvent/:eventID",
  upload.array("eventImages", 5),
  ensureAuthenticated,
  (req, res) => {
    let eventName = req.body.eventName;
    let eventDesc = req.body.eventDescription;
    let eventLocation = req.body.eventLocation;
    let eventDate = moment(req.body.eventDate, "DD/MM/YYYY");
    let eventCreator = req.user.username;

    if (req.files && req.files.length > 0) {
      let eventImages = req.files.map((file) => ({ image: file.buffer }));

      let eventImg = eventImages[0].image;
      let remainingImages = eventImages.slice(1).map((image) => image.image);
      Event.update(
        {
          eventName,
          eventDate,
          eventDesc,
          eventLocation,
          eventCreator,
          eventImg,
          images: remainingImages,
        },
        {
          where: {
            eventID: req.params.eventID,
          },
          include: "images",
        }
      )
        .then((event) => {
          res.redirect("/event/readEvent");
        })
        .catch((err) => console.log(err));
    } else {
      // If no new images are uploaded, only update the event details
      Event.update(
        {
          eventName,
          eventDate,
          eventDesc,
          eventLocation,
          eventCreator,
        },
        {
          where: {
            eventID: req.params.eventID,
          },
        }
      )
        .then((event) => {
          res.redirect("/event/readEvent");
        })
        .catch((err) => console.log(err));
    }
  }
);

router.get("/deleteEvent/:eventID", ensureAuthenticated, (req, res) => {
  Event.findOne({
    where: {
      eventID: req.params.eventID,
    },
  })
    .then((event) => {
      let eventName = event.eventName;
      if (req.user.username === event.eventCreator) {
        EventImage.destroy({
          where: {
            eventId: req.params.eventID,
          },
        }).then(() => {
          Attendee.destroy({
            where: {
              eventID: req.params.eventID,
            },
          }).then(() => {
            Event.destroy({
              where: {
                eventID: req.params.eventID,
              },
            }).then(() => {
              console.log("Event Deleted!");
              res.redirect("/event/readEvent");
            });
          });
        });
      } else {
        console.log("Unauthorised");
        req.flash("error", "Unauthorised access to event");
        res.locals.message = req.flash();
        res.redirect("/logout");
      }
    })
    .catch((err) => console.log(err));
});

router.get("/viewAttendee/:eventID", ensureAuthenticated, (req, res) => {
  Attendee.findAll({
    where: {
      eventID: req.params.eventID,
    },
    order: [["aID", "ASC"]],
    raw: true,
    nest: true,
  })
    .then((attendees) => {
      Event.findOne({
        // Use findOne instead of findAll to get a single event
        where: {
          eventID: req.params.eventID,
        },
      })
        .then((event) => {
          res.render("event/viewAttendee", {
            attendees: attendees,
            eventName: event.eventName, // Pass the eventName to the view
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/editAttendee/:aID", ensureAuthenticated, (req, res) => {
    console.log("In edit, id=", req.params.aID);
    Attendee.findOne({
      where: {
        aID: req.params.aID,
      },
  
      raw: true,
      nest: true,
    })
      .then((attendee) => {
        Event.findOne({
            where:{
                eventID : attendee.eventID
            },
            raw: true,
            nest: true
        }).then((event)=>{
            if (req.user.username === attendee.aName) {
          if (event.eventImg) {
            event.eventImg = event.eventImg.toString("base64");
          }      
              res.render("event/editAttendee", {
                event: event,
                attendee: attendee
              });

            
        } else {
          console.log("Unauthorised access to event");
          req.flash("error_msg", "Unauthorised access to event");
          res.redirect("/logout");
        }
        })
       
        
      })
      .catch((err) => console.log(err));
  });
  
  router.put(
    "/saveAttendee/:aID",
    ensureAuthenticated,
    (req, res) => {
        let aName = req.body.aName;
        let aPhoneNo = req.body.aPhoneNo;
        let aAge = req.body.aAge;
        let aGender = req.body.aGender;
        let aDiet = req.body.aDiet;
        let aEmerCont = req.body.aEmerCont;
        let aExtra = req.body.aExtra;
  
        Attendee.update(
          {
            aName,
      aPhoneNo,
      aAge,
      aGender,
      aDiet,
      aEmerCont,
      aExtra,
          },
          {
            where: {
              aID: req.params.aID,
            },
          }
        )
          .then((attendee) => {
            res.redirect("/event/readEvent");
          })
          .catch((err) => console.log(err));
      
    }
  );

  router.get("/deleteAttendee/:aID", ensureAuthenticated, (req, res) => {
    Attendee.findOne({
      where: {
        aID: req.params.aID,
      },
    })
      .then((attendee) => {
        let aName = attendee.aName;
        if (req.user.userID === attendee.userID) {
         
            Attendee.destroy({
              where: {
                aID: req.params.aID,
              },
            }).then(() => {
                console.log("Attendee Deleted!");
                res.redirect("/event/readEvent");
              });
           ;
          
        } else {
          console.log("Unauthorised");
          req.flash("error", "Unauthorised access to event");
          res.locals.message = req.flash();
          res.redirect("/logout");
        }
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
