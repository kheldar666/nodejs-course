const path = require('path');

const express = require('express');

const app = express();

//Setting the Templating Engine

// Using EJS
app.set('view engine','ejs');
app.set('views','views/ejs');

/*
// Using HandleBars
const expressHbs = require('express-handlebars');
app.engine('hbs', expressHbs({
    extname:'.hbs',
    layoutsDir:'views/hbs/layouts',
    defaultLayout:'main-layout'
}));
//Setting the View Engine.
app.set('view engine','hbs');
app.set('views','views/hbs');
*/

/* 
//Using Pug
app.set('view engine','pug');
//Setting the Templates Path
app.set('views','views/pug');
*/

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/', (req, res, next) => {
    console.log("Request URL: " + req.url);
    console.log("Request method: " + req.method);
    next();
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Managing 404
app.use((req, res, next) => {
    // Returnion Static File
    // res
    //     .status(404)
    //     .sendFile(path.join(__dirname,'views','errors','404.html'));

    // Returning Dynamic Template
    res
        .status(404)
        .render('errors/404',{
            pageTitle:'Page Not Found',
            errorMsg:'Oops ! Looks like you are lost ?',
            path:'/404',
            css:[]
            });
});

app.listen(3000);