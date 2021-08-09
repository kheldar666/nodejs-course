const path = require('path');

const express = require('express');

const User = require('./models/mongodb/user')
const dbConn = require('./utils/db-mongodb');
const dbConfig = require('./configurations/mongodb');

const app = express();

//Setting the Templating Engine
//Using EJS
app.set('view engine','ejs');
app.set('views','views');

//Importing the Routes
const adminRoutes = require('./routes/mongodb/admin');
const shopRoutes = require('./routes/mongodb/shop');


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

    User.findByStringId(dbConfig.defaultUserId)
        .then( user => {
            req.currentUser = User.getNewUser(user);
            return Promise.resolve(user);
        })
        .then( result => next() )
        .catch( err => console.error(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Managing 404
app.use(errorRoutes);


//Init the Database and Start the Server
dbConn.mongoConnect(mongoClient => {
    app.listen(3000)
})