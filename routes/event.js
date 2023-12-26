const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require('moment');
const Event = require('../models/Event');

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/readEvent', (req,res) =>{
    Event.findAll({
        order:[
            ['eventName', 'ASC']
        ],
        raw:true
    }).then((event) => {
        res.render('event/readEvent' ,{
            event: event,
        });
    })
    .catch(err => console.log(err));
});


router.get('/showCreateEvent',(req,res)=>{
    res.render('event/createEvent');//Activities view/video/addVideo.handlebars
});

// Adds new video jot from /video/addVideo
router.post('/createEvent', (req, res) => {
    let eventName = req.body.eventName;
    let eventDesc = req.body.eventDescription;
    let eventLocation = req.body.eventLocation;    
    let eventDate =  moment(req.body.eventDate, 'DD/MM/YYYY');
    let eventCreator = req.user.username;
    


    
    // Multi-value components return array of strings or undefined
    Event.create({
            eventName,
            eventDate,
            eventDesc,
            eventLocation,
            eventCreator
            
        }) .then((event) => {
            res.redirect('/event/readEvent'); 
        })
        .catch(err => console.log(err))
});

module.exports = router;