const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product',{
            pageTitle:'Add a Product',
            path:'/admin/add-product',
            css:['product','forms']
        });
}
exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop',{
                prods: products,
                pageTitle:'Martin\'s Shop',
                path:'/',
                css:['product']
        });
    });
}