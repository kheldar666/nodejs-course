const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products,fieldData]) => {
            res.render('admin/products',{
                prods: products,
                pageTitle:'Martin\'s Shop - Admin - Product List',
                path:'/admin/products',
                css:['product']
            });
        })
        .catch(error => {
            console.error(err);
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

    product.save()
        .then( () => {
            res.redirect('/admin/products');
        })
        .catch( error => {
            console.error(error);
        });
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByid(productId, product => {
        res.render('admin/edit-product',{
            pageTitle:'Martin\'s Shop - Admin - Edit a Product',
            path:'/admin/edit-product',
            css:['product','forms'],
            product: product
        });
    });
}

exports.postUpdateProduct = (req, res, next) => {
    const updatedProduct = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    );
    updatedProduct.id = req.body.productId;
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteById(req.body.productId);
    res.redirect('/admin/products');
}
