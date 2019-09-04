// Get developement Environment Variables
var path = require('path');
var os = require('os');
let state="production"
if (process.env.RELEASE !== 'production') {
    state = "development";
    require('dotenv').config();
}

var documentRoot="/Users/John/Documents/WebStorm/rest-app/rest-service/";
if (os.platform() === "linux") {
    documentRoot="?";
}

const env = {
    state: state,
    PORT: process.env.PORT,
    documentRoot: documentRoot,
    logFile: documentRoot + "service.log",
    backupLogDirectory: path.normalize(documentRoot + 'Logs/'),
    logLevel: "info",
    logBackupPrefix: "service-",
    DDB: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DDB
    }
}

module.exports = env;