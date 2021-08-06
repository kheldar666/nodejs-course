const path = require('path');

const express = require('express')

const usersRoute = require('./routes/users');

const app = express();

app.use(express.urlencoded({
    extended: false
}));

app.set('view engine','ejs');
app.set('views','views');

app.use(express.static(path.join(path.dirname(require.main.filename),'public')));
app.use(usersRoute);

app.listen(3000)
