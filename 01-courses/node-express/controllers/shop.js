const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([products,fieldData]) => {
            res.render('shop/index',{
                prods: products,
                pageTitle:'Martin\'s Shop - Welcome',
                path:'/',
                css:['product']
            })
        })
        .catch(error => {
            console.error(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products,fieldData]) => {
            res.render('shop/product-list',{
                prods: products,
                pageTitle:'Martin\'s Shop - All Products',
                path:'/products',
                css:['product']
            })
        })
        .catch(error => {
            console.error(err);
        });
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByid(productId)
        .then(([product]) => {
            console.log(product);
            console.log(product.length);
            if(product.length === 1) {
                res.render('shop/product-detail',{
                    pageTitle:'Martin\'s Shop - Details - ' + product[0].title,
                    path:'/products',
                    css:['product'],
                    product: product[0]
                });
            } else {
                // No Matching Product...
                // Continuing to generate the 404
                next();
            }
        })
        .catch( err => console.error(err))
};

exports.getCart = (req, res, next) => {
    Cart.loadCart( cart => { //C'est super bourrin....
        Product.fetchAll( products => {
            const displayCart = {
                items:[],
                totalPrice:cart.totalPrice
            };

            for(product of products) {
                for (item of cart.items) {
                    if(item.productId === product.id){
                        displayCart.items.push({product:product,qty:item.qty})
                    }
                }
            }
    
            res.render('shop/cart',{
                pageTitle:'Martin\'s Shop - Your Cart',
                path:'/cart',
                css:['product'],
                cart:displayCart
            });
        });
    });
};

exports.postAddToCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByid(productId, product => {
        Cart.addProduct(product);
        res.redirect('/cart');
    });
};

exports.postRemoveFromCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByid(productId, product => {
        Cart.removeProduct(product);
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