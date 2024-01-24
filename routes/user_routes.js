const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
router.use(bodyParser.urlencoded({extended:true}));

router.post('/register', (req, res) => 
{
    console.log("in register post")
    let errorsList = [];
    let {username, email,password, password2} = req.body;
    // Checks if both passwords entered are the same
	if (password !== password2) 
    {
		errorsList.push({text: 'Passwords do not match'});
	}
	// Checks that password length is more than 4
	if (password.length < 4 || password2.length < 4) 
    {
		errorsList.push({text: 'Password must be at least 4 characters'});
	}

    /*
	 If there is any error with password mismatch or size, then there must be
	 more than one error message in the errors array, hence its length must be more than one.
	 In that case, render register.handlebars with error messages.
	 */
     if (errorsList.length > 0) 
     {
         res.render('user/register', 
         {
             errors: errorsList,
             username: username,
             email: email,
             password: password,
             password2: password2
         });
     } else 
     {
        User.findOne({ where: {email: email} }).then(users => 
        {
            if (users) 
            {
                let msg_error = users.email + ' already registered';
                res.render('user/register', {error_msg:msg_error,username, email, password, password2 });

            } else 
            {
                //Generate salt hashed password
                bcrypt.genSalt(10,(err,salt)=>
                {
                    bcrypt.hash(password,salt,(err,hash)=>{
                        if(err) throw err;
                        password = hash
                    
                        User.create({ username, email, password }).then(users => 
                        {
                            let msg_success = users.email+' registered, Please login in.';
                            res.render('user/login',{layout:'main', 
                            success_msg:msg_success});
                        }).catch(err=>console.log(err));
                    })
                })
            }
        });
     }

});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        
        successRedirect:false,
        failureRedirect:'/login',
        failureFlash:true,
    })(req,res, (err)=>{
        if (req.user.role == 1) {
            return res.redirect('/event/admin')
        } else{
            return res.redirect('/event/readEvent')
        }
    }) 

});

/*
router.post('/login', (req, res) => {
    console.log("in login post")
    let errorsList = [];
    let {email,password} = req.body;
    User.findOne({ where: {email: email} }).then(user => 
    {
        if (user) 
        {
            bcrypt.compare(password, user.password, (err, isMatch) => 
            { 
                if(err) throw err; 
            
                if(isMatch) 
                { 
                    res.redirect('/listVideos');
                     
                } else 
                { 
                    let msg_error = 'Login failed';
                    res.render('user/login',{layout:'main', 
                    error_msg:msg_error});
                } 
            })
        }
    })
});

*/


module.exports = router;