'use strict';

var winston = require('winston'),
    config = require('./config');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: config.root + '/logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: config.root + '/logs/exceptions.log',
            maxsize: 5242880,
            maxFiles: 50
        })
    ],
    exitOnError: false
});

logger.logError = function(err) {
    logger.error(JSON.stringify(err));
}

logger.logDebug = function(msg) {
    logger.debug(msg);
}

logger.logInfo = function(msg) {
    logger.info(msg);
}

module.exports = logger;

module.exports.stream = {
    write: function(message){
        logger.info(message);
    }
};
