exports.getLogin = (req, res, next) => {
    res.render('mongodb/auth/login',{
        pageTitle:'Martin\'s Shop - Login',
        path:'/login',
        css:['forms','auth'],
        isAuthenticated:req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn=true;
    res.redirect('/')
};
