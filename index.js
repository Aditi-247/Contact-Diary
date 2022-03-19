const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./config/mongoose');
// use for session cookie
const  session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport_google_oauth');
// const MongoStore = require('connect-mongo')(session);
// const Contact = require('./models/contact');



app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use('/uploads', express.static(__dirname+'/uploads'));


// app.use(expressLayouts);
// setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store to store the session cookie in the db
app.use(session({
    name:'Contact_list',
    secret:'blahsomething',
    saveUninitialized: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    // store: new MongoStore(
    //     {
    //         mongooseConnection: db,
    //         autoRemove : 'disabled'
    //     },
    //     fuction(err,xy){
    //         console.log('connect-');
    //     }         
    // )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use('/', require('./Routes'));



var ContactList = [
    {
        name: 'Aditi',
        phone: '7879123292',
    },
    {
        name: 'Suraj',
        phone: '9999104441',
    },
]

app.get('/practice', function(req,res){
    return res.render('practice',{title: 'Profile'});
});

app.listen(port, function(err){
    if(err){
        console.log('Error occured while runnimg the server:', err)
    }
    console.log('cool! express server is running on port:', port)
});
