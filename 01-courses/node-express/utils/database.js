const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    database: 'node-express',
    user: 'root',
    password:'admin'
});

module.exports = pool.promise();