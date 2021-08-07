const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index',{
            prods: products,
            pageTitle:'Martin\'s Shop - Welcome',
            path:'/',
            css:['product']
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list',{
                prods: products,
                pageTitle:'Martin\'s Shop - All Products',
                path:'/products',
                css:['product']
        });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart',{
        pageTitle:'Martin\'s Shop - Your Cart',
        path:'/cart',
        css:['product']
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders',{
        pageTitle:'Martin\'s Shop - Orders',
        path:'/orders',
        css:['product']
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout',{
        pageTitle:'Martin\'s Shop - Checkout',
        path:'/checkout',
        css:['product']
    });
};