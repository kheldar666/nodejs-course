const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('add-product',{
            pageTitle:'Add a Product',
            path:'/admin/add-product',
            css:['product','forms']
        });
}
exports.postAddProducts = (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.render('shop',{
            prods: products,
            pageTitle:'Martin\'s Shop',
            path:'/',
            css:['product']
    });
}