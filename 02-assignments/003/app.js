const path = require('path');

const express = require('express')

const app = express();

const adminRoute = require('./routes/admin');
const usersRoute = require('./routes/users');
const rootDir = require('./utils/path');

app.use(express.static(path.join(rootDir,'public')));

app.use('/admin/',adminRoute);

app.use(usersRoute);

app.listen(3000)
