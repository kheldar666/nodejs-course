const Product = require('../../models/mongodb/product');
  
exports.getProducts = (req, res, next) => {
    Product.find()
        //.select('title price -userId') // only fetch the fields we want
        //.populate('createdBy', 'name') //populate the data from relations
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
            product:new Product()
        });
}

exports.postAddProducts = (req, res, next) => {
    const product = new Product({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        imageUrl:req.body.imageUrl,
        createdBy: req.currentUser
    });
    
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err) );
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
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

    Product.findById(productId)
        .then( product => {
            if(product) {
                product.title=req.body.title
                product.price=req.body.price
                product.description=req.body.description
                product.imageUrl=req.body.imageUrl
                return product.save();
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
    Product.findByIdAndRemove(productId)
        .then( result => {
            res.redirect('/admin/products');
        })
        .catch( err => console.error(err))
}
