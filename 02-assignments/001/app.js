const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.routes);

server.listen(3000);