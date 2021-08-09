const path = require('path');

const express = require('express');

const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

//Setting the Templating Engine
//Using EJS
app.set('view engine','ejs');
app.set('views','views');

//Importing the Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/errors');
const e = require('express');

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

//Creating Relations between Models
Product.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Product.belongsToMany(Cart, {through: CartItem})
Product.belongsToMany(Order, {through: OrderItem})

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Cart.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Cart.belongsToMany(Product, {through: CartItem});

Order.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Order.belongsToMany(Product, {through: OrderItem});


//Init the Database and Start the Server
let currentUser;
sequelize
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
    .then( products => {
        app.listen(3000)
    })
    .catch(err => console.error(err));