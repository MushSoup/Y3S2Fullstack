const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

function localStrategy(passport){
    console.log("in localStrategy")
       passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        console.log("in passport.use")
       User.findOne({ where: {email: email} })
            .then(users => {
                if(!users) {
                    return done(null, false, {message: 'No User Found'});
                }           
                // Match password
                bcrypt.compare(password, users.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, users);
                    } else {
                        return done(null, false, {message: 'Password incorrect'});
                    }
                })
            })
    }));
    
// Serializes (stores) user id into session upon successful
// authentication 
    passport.serializeUser((users, done) => {
        console.log("in serializeUser")

        done(null, users.userID); // user.id is used to identify authenticated user 
    });
// User object is retrieved by userId from session and 
// put into req.user
    passport.deserializeUser((userId, done) => {
        console.log("in deserializeUser")
        User.findByPk(userId)
            .then((users) => {
                done(null, users); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = {localStrategy};
