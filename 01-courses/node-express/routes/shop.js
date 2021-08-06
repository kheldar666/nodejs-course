const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const adminData = require('../routes/admin')

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;

    //returning a static file
    //res.sendFile(path.join(rootDir, 'views','html','shop.html'));
    
    //returning a dynamic template
    res.render('shop',{prods: products, docTitle:'Martin\'s Shop', path:'/'});
});

module.exports = router;