const path = require('path');

const express = require('express');

const app = express();

//Setting the Templating Engine

// Using EJS
app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/errors');

app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/', (req, res, next) => {
    console.log("Request URL: " + req.url);
    console.log("Request method: " + req.method);
    next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Managing 404
app.use(errorRoutes);

app.listen(3000);