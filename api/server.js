process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var fs = require('fs')
var morgan = require('morgan')
var FileStreamRotator = require('file-stream-rotator')
var db = mongoose();
var app = express();
var fileName = function () {
    var today = new Date();
    return today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
}

var accessLogStream = FileStreamRotator.getStream({
        filename: 'logs/access.log',
        frequency: 'daily',
        verbose: false
    })
    //var accessLogStream = fs.createWriteStream(__dirname + '/logs/'+fileName()+'.log', {flags: 'a'})

// setup the logger
// create a write stream (in append mode)

// setup the logger
app.use(morgan('combined', {
    stream: accessLogStream
}))
app.use(function (req, res, next) {
    // console.log('call');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,accept,query,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err.stack);
});

app.listen(3009);
module.exports = app;
console.log('Server running at http://localhost:3009/');
