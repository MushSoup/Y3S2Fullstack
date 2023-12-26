const express = require('express');
const router = express.Router();


healthyFoodAPi = function(){
    return [
        {
            category: 'HealthyFoods',
            food: 'Dark Green Vegetables'
        },
        {
            category: 'HealthyFoods',
            food: 'Whole grains'
        },
        {
            category: 'HealthyFoods',
            food: 'Fish'
        },
        {
            category: 'HealthyFoods',
            food: 'Berries'
        },
        {
            category: 'HealthyFoods',
            food: 'Soy'
        },
        {
            category: 'HealthyFoods',
            food: 'Winter Squash'
        }
    ];
}


router.get('/',function(req,res){
    res.render('index',{layout:'main' ,  greetings:"Good Day!", healthyFds:healthyFoodAPi(),listExists:true});
});

router.get('/abt',function(req,res){
    let msg_success = "Success message using success_msg!";
    let msg_error = "Error message using error_msg!";

    res.render('about',{layout:'main', 
    success_msg:msg_success,
    error_msg:msg_error});
});

router.get('/register', (req, res) => {
    res.render('user/register', {layout:'main'
    });
});

router.get('/login', (req, res) => {
    console.log("in login get")
    res.render('user/login', {layout:'main'
    });
});

router.get('/logout', function(req, res, next) {
    console.log("loggin out:",res.locals.error_msg)
   // console.log("loggin out:",res.locals.message.error)
    //req.flash('error_msg', res.locals.error_msg);
    req.logout(function(err) {
      if (err) { return next(err); }
      //req.flash('error_msg', res.locals.error_msg);
      //res.locals.message = req.flash();
      res.redirect('/');
    });
  });

router.get('/createEvent', function(req, res) {
    res.render('event/createEvent', { layout: 'main' });
});

router.post('/createEvent', function(req, res) {
    res.redirect('event/readEvent');
});


router.get('/createForum', function(req, res) {
    res.render('forum/createForum', { layout: 'main' });
});

router.post('/createForum', function(req, res) {
    res.redirect('/readForum');
});

router.get('/readForum', function(req, res) {
    // Logic to retrieve forum information from the database and render it in the view
    // 
    res.render('forum/readForum', { forumData: 'List of forum' });
});



module.exports = router;
