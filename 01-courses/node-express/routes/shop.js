//const path = require('path');

const express = require('express');

//const rootDir = require('../utils/path');

const adminData = require('../routes/admin')

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;

    //returning a static file
    //res.sendFile(path.join(rootDir, 'views','html','shop.html'));
    
    //returning a dynamic template
    // for Pug
    // res.render('shop',{prods: products, pageTitle:'Martin\'s Shop', path:'/'});

    //For HBS, we need to put the logic here
    //Add "layout" key here to false by default to disable the default layout
    res.render('shop',{
            prods: products,
            pageTitle:'Martin\'s Shop',
            path:'/',
            css:['product']
        });

});

module.exports = router;