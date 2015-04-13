'use strict';

var winston = require('winston'),
    config = require('./config');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'file.info',
            level: 'info',
            filename: config.root + '/logs/all.log',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false,
            handleExceptions: true
        }),
        new winston.transports.File({
            name: 'file.error',
            level: 'error',
            filename: config.root + '/logs/error.log',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false,
            handleExceptions: true
        }),
        new winston.transports.Console({
            name: 'console.all',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: config.root + '/logs/exception.log',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false
        }),
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.logError = function (err) {
    logger.error(err);
};

logger.logDebug = function (msg) {
    logger.debug(msg);
};

logger.logInfo = function (msg) {
    logger.info(msg);
};

module.exports = logger;

module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};
