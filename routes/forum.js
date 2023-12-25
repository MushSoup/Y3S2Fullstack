const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require('moment');
const Forum = require('../models/Forum');

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/readForum', (req,res) =>{
    Forum.findAll({
        order:[
            ['fDate', 'ASC']
        ],
        raw:true
    }).then((forums) => {
        res.render('forum/readForum' ,{
            forums: forums
        });
    })
    .catch(err => console.log(err));
});


router.get('/showCreateForum',(req,res)=>{
    res.render('forum/createForum');//Activities view/video/addVideo.handlebars
});

// Adds new video jot from /video/addVideo
router.post('/createForum', (req, res) => {
    let fName = req.body.forumName;
    let fType = req.body.forumType;
    let fDate =  moment(new Date(), 'DD/MM/YYYY');
    


    
    // Multi-value components return array of strings or undefined
    Forum.create({
            fName,
            fType,
            fDate
        }) .then((forums) => {
            res.redirect('/forum/readForum'); 
        })
        .catch(err => console.log(err))
});

module.exports = router;