const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require('moment');
const Event = require('../models/Event');
const cookieParser = require('cookie-parser');
const multer = require('multer'); // Import multer

router.use(cookieParser());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.get('/readEvent', (req, res) => {
    Event.findAll({
        order: [
            ['eventName', 'ASC']
        ],
        raw: true
    }).then((event) => {
        event.forEach(event => {
            if (event.eventImg) {
                event.eventImg = event.eventImg.toString('base64');
            }
        });

        res.render('event/readEvent', {
            event: event,
        });
    })
        .catch(err => console.log(err));
});

router.get('/showCreateEvent', (req, res) => {
    res.render('event/createEvent'); // Activities view/video/addVideo.handlebars
});

// Adds new event from /event/createEvent
router.post('/createEvent', upload.single('eventImage'), (req, res) => {
    let eventName = req.body.eventName;
    let eventDesc = req.body.eventDescription;
    let eventLocation = req.body.eventLocation;
    let eventDate = moment(req.body.eventDate, 'DD/MM/YYYY');
    let eventCreator = req.user.username;

    // Access the uploaded file from req.file
    let eventImg = req.file.buffer; // Assuming the field name in the form is "eventImage"

    // Multi-value components return array of strings or undefined
    Event.create({
        eventName,
        eventDate,
        eventDesc,
        eventLocation,
        eventCreator,
        eventImg // Save the image data to the database
    }).then((event) => {
        res.redirect('/event/readEvent');
    })
        .catch(err => console.log(err))
});

router.get('/expandedEvent/:eventID', (req, res) => {
    console.log("In edit, id=",req.params.eventID)
    Event.findOne({
        where:{
            eventID: req.params.eventID
        },raw:true,
        nest: true
    }).then((event) =>{
        if (event.eventImg) {
            event.eventImg = event.eventImg.toString('base64');
        }
        res.render('event/expandedEvent',{
            event: event,
        })
    }).catch(err => console.log(err));
});

module.exports = router;
