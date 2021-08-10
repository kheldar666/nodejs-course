const path = require('path');

const express = require('express');
const mongoose = require('mongoose')

const User = require('./models/mongodb/user')
const dbConfig = require('./configurations/mongodb');
const appConfig = require('./configurations/app');

const app = express();

//Setting the Templating Engine
//Using EJS
app.set('view engine','ejs');
app.set('views','views');

//Importing the Routes
const adminRoutes = require('./routes/mongodb/admin');
const shopRoutes = require('./routes/mongodb/shop');
const authRoutes = require('./routes/mongodb/auth');

//Managing Error Routes
const errorRoutes = require('./routes/errors');

//Process the forms/query strings
app.use(express.urlencoded({
    extended: false
}));

//Setup the static/public path
app.use(express.static(path.join(__dirname,'public')));

//Setup Routes Management and Middlewares
app.use((req, res, next) => {
    console.log("Request URL: " + req.url);
    console.log("Request method: " + req.method);

    User.findById(dbConfig.defaultUserId)
        .then( user => {
            req.currentUser = user;
        })
        .then( result => next() )
        .catch( err => console.error(err));

});

app.use(authRoutes);

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Managing 404
app.use(errorRoutes);


//Init the Database and Start the Server
mongoose.connect(dbConfig.connectionString, {
        useNewUrlParser:true,
        useUnifiedTopology: true
    })
    .then( result => {
        return User.findOne()
            .then( defaultUser => {
                if(!defaultUser) {
                    const defaultUser = new User({
                        name:'Administrator',
                        email:'admin@localhost',
                        cart:{items:[]}
                    })
                    return defaultUser.save();
                }
            } )
    })
    .then( result => {
        console.info('Starting Node.JS App Server')
        app.listen(appConfig.port)
    })
    .catch(err => console.error(err))