const path = require('path');

const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
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

app.use('/admin', adminRoutes);

app.use(shopRoutes);

// Managing 404
app.use((req, res, next) => {
    res
        .status(404)
        .sendFile(path.join(__dirname,'views','errors','404.html'));
});

app.listen(3000);