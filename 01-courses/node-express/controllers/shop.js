const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByid(productId,(product) => {
        res.render('shop/product-detail',{
            pageTitle:'Martin\'s Shop - Details - ' + product.title,
            path:'/products',
            css:['product'],
            product: product
        });
    })
};

exports.getCart = (req, res, next) => {
    Cart.loadCart( cart => {
        const displayCart = {
            items:[],
            totalPrice:cart.totalPrice
        };

        displayCart.items = cart.items.map( item => {
            const productId = Object.keys(item)[0];
            let newItem = {product:{title:"dummy"},quantity:2};

            Product.findByid(productId, (product) => {
                newItem = {
                    product:product,
                    quantity:item[productId]
                };
                //return newItem;
            });

            return newItem;
        })

        res.render('shop/cart',{
            pageTitle:'Martin\'s Shop - Your Cart',
            path:'/cart',
            css:['product'],
            cart:displayCart
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByid(productId, product => {
        Cart.addProduct(product);
        res.redirect('/cart');
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