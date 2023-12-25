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
            ['eName', 'ASC']
        ],
        raw:true
    }).then((events) => {
        res.render('event/readEvent' ,{
            events: events,
        });
    })
    .catch(err => console.log(err));
});


router.get('/showCreateEvent',(req,res)=>{
    res.render('event/createEvent');//Activities view/video/addVideo.handlebars
});
router.get('/showReadEvent',(req,res)=>{
    res.render('event/readEvent');//Activities view/video/addVideo.handlebars
});

// Adds new video jot from /video/addVideo
router.post('/createEvent', (req, res) => {
    let eName = req.body.eventName;
    let eDesc = req.body.eventDescription;
    let eLocation = req.body.eventLocation;    
    let eDate =  moment(req.body.eventDate, 'DD/MM/YYYY');
    


    
    // Multi-value components return array of strings or undefined
    Event.create({
            eName,
            eDesc,
            eLocation,
            eDate
            
        }) .then((events) => {
            res.redirect('/event/readEvent'); 
        })
        .catch(err => console.log(err))
});

module.exports = router;