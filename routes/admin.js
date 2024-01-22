const express = require('express');
const router = express.Router();
const passport = require('passport');

const Admin = require('../models/Admin');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({extended:true}));

router.post('/adminRegister', (req, res) => 
{
    console.log("in register post")
    let errorsList = [];
    let {adminName, adminEmail} = req.body;
    // Checks if both passwords entered are the same
	

    /*
	 If there is any error with password mismatch or size, then there must be
	 more than one error message in the errors array, hence its length must be more than one.
	 In that case, render register.handlebars with error messages.
	 */
     if (errorsList.length > 0) 
     {
         res.render('admin/adminRegister', 
         {
             errors: errorsList,
             adminName: adminName,
             adminEmail: adminEmail,
         });
     } else 
     {
        Admin.findOne({ where: {adminEmail: adminEmail} }).then(admins => 
        {
            if (admins) 
            {
                let msg_error = admins.adminEmail + ' already registered';
                res.render('admin/adminRegister', {error_msg:msg_error,adminName, adminEmail });

            } else 
            {

                    
                        Admin.create({ adminName, adminEmail }).then(admins => 
                        {
                            let msg_success = admins.adminEmail+' registered, Please login in.';
                            res.render('admin/adminLogin',{layout:'main', 
                            success_msg:msg_success});
                        }).catch(err=>console.log(err));
                    
                
            }
        });
     }

});

router.post('/adminLogin',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/event/readEvent',
        failureRedirect:'/adminLogin',
        failureFlash:true,
    })(req,res,next)
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