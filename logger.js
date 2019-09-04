const global = require('./global');
const path = require('path');
const { createLogger, transports } = require('winston');

const logFile = path.normalize(global.logFile);

//************** Create Logger
const logger = createLogger({
    level: global.logLevel,
    transports: [
        new (transports.Console)({
        })
    ]
});

module.exports = logger;