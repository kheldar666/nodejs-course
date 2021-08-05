const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handler);

console.log(routes.sometext);

server.listen(3000);