'use strict';

var morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('../common/setup/logger');

module.exports = function (app, logger) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({type: 'application/*+json'}));
    app.use(function (err, req, res, next) {
        if (err) {
            logger.logError('express - error in request');
            logger.logError(err);
            res.status(200).send({error: 'input-error'});
        } else {
            next();
        }
    });
    app.use(methodOverride());
    app.use(morgan('combined', {'stream': logger.stream}));
};
