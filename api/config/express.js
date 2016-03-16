process.env.NODE_ENV = process.env.NODE_ENV || 'development';
config = require('./config'),
    express = require('express');
morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
session = require('express-session');
logger = require('./logger');
var multer = require('multer');
var path = require('path');
var cors = require('cors');

module.exports = function () {
    express.response.success = function (obj) {
        this.json({
            status: 'success',
            data: obj
        });
    };
    express.response.error = function (msg) {
        this.json({
            status: 'error',
            message: msg
        });
    };
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Enable logger (morgan)
    app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(function (err, req, res, next) {
        var error = err.error || err;
        var message = err.message || err;
        var status = err.status || 500;

        res.status(status);
        res.format({
            html: function () {
                res.json({
                    status: 'error',
                    message: message,
                    error: {}
                });
            }
        });
    });

    //var done=false;
    app.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
                //done=true;
        }
    }));
    app.use("/uploads", express.static(path.join(__dirname, '../uploads')));

    //enabling croos origin requests
    app.use(cors());

    app.use(bodyParser.json());
    app.use(methodOverride());
    require('../app/routes/indexRoute.js')(app);
    return app;
};