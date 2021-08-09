const path = require('path');

const express = require('express');

const dbConn = require('./utils/db-mysql');

// Initializing Sequelize Models
require('./models/mysql/mysql-definitions');
 
// Import Models
const User = require('./models/mysql/user');
const Product = require('./models/mysql/product');

const app = express();

//Setting the Templating Engine
//Using EJS
app.set('view engine','ejs');
app.set('views','views');

//Importing the Routes
const adminRoutes = require('./routes/mysql/admin');
const shopRoutes = require('./routes/mysql/shop');


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

    User.findByPk(1)
        .then( user => {
            req.currentUser = user;
            return Promise.resolve();
        })
        .then( result => next() )
        .catch( err => console.error(err));    
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Managing 404
app.use(errorRoutes);


//Init the Database and Start the Server
let currentUser;
dbConn.sequelize
    .sync({force:false})
    .then( result => {
        return User.findByPk(1);
    })
    .then( user => {
        if(!user) {
            // Let's create a default User
             return User.create({name:'Administrator',email:'admin@localhost'})
        }
        return Promise.resolve(user);
    })
    .then( admin => {
        currentUser = admin;
        return Product.findAll()
    })
    .then( products => {
        if(!products.length > 0) {
            // Let's create a default Product
            return currentUser.createProduct({
                title:'The Lord of The Rings',
                price:57,
                description:'The famous book by JRR Tolkien'
            })
        }
        return Promise.resolve(products);
    })
    .then( result => {
        app.listen(3000)
    })
    .catch(err => console.error(err));