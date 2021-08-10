exports.getLogin = (req, res, next) => {
    res.render('mongodb/auth/login',{
        pageTitle:'Martin\'s Shop - Login',
        path:'/login',
        css:['forms','auth']
    })
}

exports.postLogin = (req, res, next) => {
    res.redirect('/')
};
