const express = require('express')

const router = express.Router();

const users = [];

router.get('/',(req, res, next) => {
    res
        .render('home',{
            pageTitle:"Home Page"
        });
});
router.get('/users',(req, res, next) => {
    res
        .render('users',{
            pageTitle:"User List",
            userList:users
        });
});
router.post('/users',(req, res, next) => {
    users.push(req.body.username);
    res
        .redirect('/users');
});

module.exports = router
