const Product = require('../models/product');

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

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product',{
            pageTitle:'Martin\'s Shop - Admin - Add a Product',
            path:'/admin/add-product',
            css:['product','forms'],
            product:Product.getEmptyProduct()
        });
}

exports.postAddProducts = (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    );
    product.save();
    res.redirect('/admin/products');
}

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product',{
        pageTitle:'Martin\'s Shop - Admin - Edit a Product',
        path:'/admin/edit-product',
        css:['product','forms'],
        product:Product.getProduct(0)
    });
}

exports.getUpdateProduct = (req, res, next) => {
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {

    res.redirect('/admin/products');
}
