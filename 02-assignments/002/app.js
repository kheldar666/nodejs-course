const express = require('express')

const app = express();

app.use('/users', (req, res, next)=> {
    console.log("First MW");
    res.send("<h1>Users List</h1>");
});
app.use('/', (req, res, next)=> {
    console.log("Second MW");
    res.send("<h1>Welcome Here</h1>");
});

app.listen(3000);