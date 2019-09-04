const global = require('./global');

// Express: used for handling HTTP requests
const express = require('express');
const app = express();

// Morgan: used to log all requests for developement
const log = require('morgan');
app.use(log('dev'));

// Body-Parser: Used to break request into body object for easier handling
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Modify Headers to allow RESTful communications without CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');  // all, could be http://...
    res.header('Access-Control-Allow-Headers','*'); // Origin, X-Requested-With, Content-Type, Accept, Authorization
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Handle Authentication Requests
const autenticateRoute = require('./routes/authenticate');
app.use('/auth',autenticateRoute);

const restaurantRoute = require('./routes/restaurants');
app.use('/rest',restaurantRoute);

const reviewRoute = require('./routes/review');
app.use('/review',reviewRoute);

// Catch All URL for invalid URL requests
app.use((req, res, next) => {
    const method = req.method;
    const url    = req.url;
    const error = new Error("Unknown Request Received @" + process.env.PORT + ", method: " + method + ", URL: " + url);
    error.status = 404;
    next(error);
});

// Error Handling if program glitches
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;