const Product = require('../../models/mongodb/product');
  
exports.getProducts = (req, res, next) => {
    Product.fetchAll() 
        .then(products => {
            res.render('mongodb/admin/products',{
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
    res.render('mongodb/admin/add-product',{
            pageTitle:'Martin\'s Shop - Admin - Add a Product',
            path:'/admin/add-product',
            css:['product','forms'],
            product:Product.getEmptyProduct()
        });
}

exports.postAddProducts = (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        null,
        req.currentUser._id
    );
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err) );
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByStringId(productId).then(product => {
        res.render('mongodb/admin/edit-product',{
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

    Product.findByStringId(productId)
        .then( product => {
            if(product) {
                const updatedProduct= new Product(
                    req.body.title,
                    req.body.price,
                    req.body.description,
                    req.body.imageUrl,
                    product._id,
                    req.currentUser._id
                )
                return updatedProduct.save();
            }
            return Promise.reject('Product not found.')
        })
        .then(result => { 
            console.info('Product updated') 
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err) );        
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteByStringId(productId)
        .then( result => {
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err))
}
