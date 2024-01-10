const express = require('express') 
const session = require('express-session');
const exphbs = require('express-handlebars')//importing the express handlebars
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt = require('bcryptjs');// for password encryption
const app = express() 
const User = require('./models/User');
const Event = require('./models/Event');
const db = require('./config/db');
const mainRoute = require('./routes/main');
const userRoute = require('./routes/user_routes');
const videoRoute = require('./routes/video');
const eventRoute = require('./routes/event');
const forumRoute = require('./routes/forum')
const MySQLStore = require('express-mysql-session')(session);
// Bring in Handlebars Helpers here
const {formatDate,radioCheck} = require('./helpers/hbs'); 
const healthappDB = require('./config/DBConnection');
const authenticate = require('./config/passport');
const methodOverride = require('method-override');

// Connects to MySQL database
healthappDB.setUpDB(false); // To set up database with new tables set (true)
// Passport Config

authenticate.localStrategy(passport);

app.engine('handlebars', exphbs.engine({
    layoutsDir:__dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials/',
    helpers: {
		formatDate: formatDate,
        radioCheck: radioCheck,
	}
}));

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });

//set our apps to use the handlebars engine
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

//configuration for use of session
const options = {
    host: db.host,
    port:db.port,
    user:db.username,
    password:db.password,
    database:db.database,
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session; milliseconds:
    expiration: 900000,
}
const sessionStore = new MySQLStore(options);
app.use(session({
    key:'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave:false,
    saveUninitialized:false
}));

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next)
{ 	
	res.locals.user = req.user || null; next(); 
});

app.use('/', mainRoute); // mainRoute is declared to point to routes/main.js
app.use('/user', userRoute); // userRoute is declared to point to routes/user_routes.js
app.use('/video', videoRoute); // videoRoute is declared to point to routes/video.js
app.use('/event',eventRoute);
app.use('/forum', forumRoute)
//Sets handlebars configurations


let port = 3001

app.get('/bmiCal',function(req,res){
    res.render('bmi/bmiCal',{layout:'main'});
});


app.post("/bmiResults", function(req,res){
    res.render('bmi/bmiResults',{layout:'main',
        custName: req.body.txtName,
        custWeight:req.body.txtWeight,
        custHeight:req.body.txtHeight

    })
});

//Starting the server on the designated port.
//no commands will run after this line as the server starts
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
});