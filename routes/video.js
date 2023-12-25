const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require('moment');
const Video = require('../models/Video');

const cookieParser = require('cookie-parser');

router.use(cookieParser());

// List videos belonging to current logged in user
// router.get('/listVideos', (req, res) => {
//     console.log("in video.js /listVideos")
//     console.log("user:",req.user)
//     Video.findAll({
//             where: {
//                 userId: req.user.id
//             },
//             order: [
//                 ['title', 'ASC']
//             ],
//             raw: true
//         })
//         .then((videos) => {
//             // pass object to listVideos.handlebar
//             res.render('video/listVideos', { 
//                 videos: videos
//             });
//         })
//         .catch(err => console.log(err));
// });


router.get('/showAddVideo',(req,res)=>{
    res.render('video/addVideo');//Activities view/video/addVideo.handlebars
});

// Adds new video jot from /video/addVideo
router.post('/addVideo', (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease =  moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;
    
    // Multi-value components return array of strings or undefined
    Video.create({
            title,
            story,
            classification,
            language,
            subtitles,
            dateRelease,
            userId
        }) .then((video) => {
            res.redirect('/video/listVideos'); 
        })
        .catch(err => console.log(err))
});

// Shows edit video page
router.get('/edit/:id', (req, res) => {
    console.log("In edit, id=",req.params.id)
    Video.findOne({
        where: {
            id: req.params.id
        },raw: true,
        nest: true
    }).then((video) => {
        checkOptions(video);
	  // call views/video/editVideo.handlebar to render the edit video page
        res.render('video/editVideo', { 
            video	// passes video object to handlebar 
        });
    }).catch(err => console.log(err)); // To catch no video ID
});

// Creates variables with ‘check’ to put a tick in the appropriate checkbox 
function checkOptions(video){
    video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
    video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
    video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
    video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';

    video.chineseSub = (video.subtitles.search('Chinese') >= 0) ? 'checked' : '';
    video.englishSub = (video.subtitles.search('English') >= 0) ? 'checked' : '';
    video.malaySub = (video.subtitles.search('Malay') >= 0) ? 'checked' : '';
    video.tamilSub = (video.subtitles.search('Tamil') >= 0) ? 'checked' : '';
}

// Save edited video
router.put('/saveEditedVideo/:id', (req, res) => {
    console.log("In saveEditedVideo,"+req.params.id)
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;

    Video.update({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease
    }, {
        where: {
            id: req.params.id
        }
    }).then((video) => {
        // After saving, redirect to router.get(/listVideos) to retrieve all updated videos
        res.redirect('/video/listVideos');
    }).catch(err => console.log(err))
});


module.exports = router;