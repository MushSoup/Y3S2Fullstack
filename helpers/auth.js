const ensureAuthenticated = (req, res, next) => {
    console.log("In ensureAuthenticated!!")
    if(req.isAuthenticated()) { // If user is authenticated
    return next(); // Calling next() to proceed to the next
    statement
 }
 console.log("Access Denied")

    req.flash('error_msg', "Access Denied");
 res.redirect('/');
 };
     module.exports = ensureAuthenticated;