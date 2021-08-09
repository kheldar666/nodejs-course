const Product = require('../../models/mongodb/product');
const User = require('../../models/mongodb/user');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('mongodb/shop/index',{
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
        .then(products => {
            res.render('mongodb/shop/product-list',{
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
    Product.findById(productId)
        .then(product => {
            res.render('mongodb/shop/product-detail',{
                pageTitle:'Martin\'s Shop - Details - ' + product.title,
                path:'/products',
                css:['product'],
                product: product
            });
        })
        .catch( err => {
            console.error(err)
            next(); // Should go to 404
        })
};

exports.getCart = (req, res, next) => {
    const userCart = req.currentUser.cart;
    res.render('mongodb/shop/cart',{
        pageTitle:'Martin\'s Shop - Your Cart',
        path:'/cart',
        css:['product','cart'],
        cartProducts:userCart.items
    });
};

exports.postAddToCart = (req, res, next) => {
    const productId = req.body.productId;

    Product.findByStringId(productId)
        .then( product => {
            return req.currentUser.addToCart(product);
        })
        .then(result => res.redirect('/cart'))
        .catch(err => console.error(err));

};

// exports.postRemoveFromCart = (req, res, next) => {
//     const productId = req.body.productId;
//     req.currentUser.getCart()
//         .then( cart => {
//             return cart.getProducts({where:{id:productId}})
//         })
//         .then(products => {
//             const product = products[0];
//             return product.cartItem.destroy();
            
//         })
//         .then(result => {
//             res.redirect('/cart'); 
//         })
//         .catch(err => console.error(err))
// };

// exports.createOrder = (req, res, next) => {
//     let fetchedCart;
//     req.currentUser.getCart()
//     .then(cart => {
//         fetchedCart = cart;
//         return cart.getProducts();
//     })
//     .then( products => {
//         // Transfer all Products from Cart to Order
//         return req.currentUser.createOrder()
//             .then( order => {
//                 order.addProducts(products.map( product => {
//                     product.orderItem = {quantity : product.cartItem.quantity}
//                     return product;
//                 }))
//             })
//     })
//     .then( result => {
//         //Cleanup the Cart
//         return fetchedCart.setProducts(null);
//     })
//     .then( result => {
//         res.redirect('/orders')
//     })
//     .catch(err => console.error(err));
// };

// exports.getOrders = (req, res, next) => {
//     req.currentUser.getOrders({include:['products']})
//     .then( orders => {
//         res.render('mongodb/shop/orders',{
//             pageTitle:'Martin\'s Shop - Orders',
//             path:'/orders',
//             css:['product'],
//             orders:orders
//         })
//     })
//     .catch(err => console.error(err))
// };