const Product = require('../../models/mysql/product');
  
exports.getProducts = (req, res, next) => {
    req.currentUser.getProducts() //Gets all Products created by the current User
        .then(products => {
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
            product:Product.build()
        });
}

exports.postAddProducts = (req, res, next) => {
    req.currentUser
        .createProduct({
            title:req.body.title,
            price:req.body.price,
            imageUrl:req.body.imageUrl,
            description:req.body.description
        }).then(result => {
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err) );
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId).then(product => {
        res.render('admin/edit-product',{
            pageTitle:'Martin\'s Shop - Admin - Edit a Product',
            path:'/admin/edit-product',
            css:['product','forms'],
            product: product
        });
    })
    .catch( err => console.error(err) );
}

exports.postUpdateProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.findByPk(productId)
        .then( product => {
            product.title = req.body.title,
            product.imageUrl = req.body.imageUrl,
            product.description = req.body.description
            product.price = req.body.price
            return product.save();
        })
        .then(result => { 
            console.info('Product updated') 
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err) );        
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.findByPk(productId).then( product => {
        product.destroy();
        res.redirect('/admin/products');
    })
    .catch( err => console.error(err))
}
