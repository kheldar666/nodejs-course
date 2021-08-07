const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product',{
            pageTitle:'Martin\'s Shop - Admin - Add a Product',
            path:'/admin/add-product',
            css:['product','forms']
        });
}

exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products',{
                prods: products,
                pageTitle:'Martin\'s Shop - Admin - Product List',
                path:'/admin/products',
                css:['product']
        });
    });
}