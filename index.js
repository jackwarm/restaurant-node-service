const global = require('./global');
const log = require('./logger');
const http = require('http');
const app = require('./app');
const port = global.PORT;
log.info("Listening on Port: " + port + ", status: " + global.state);
const server = http.createServer(app);
server.listen(port);