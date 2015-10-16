'use strict';

var express = require('express'),
    morgan = require('morgan'),
    config = require('../common/setup/config'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon');

module.exports = function (app, logger) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    app.set('views', config.root + config.crmClientPath);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({type: 'application/*+json'}));
    app.use(function (err, req, res, next) {
        if (err) {
            logger.logError('crmApp - express - error in request');
            logger.logError(err);
            res.status(200).send({error: 'input-error'});
        } else {
            next();
        }
    });
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(favicon(config.root + config.crmClientPath + '/images/favicon.ico'));
    app.use(express.static(config.root + config.crmClientPath));
    app.use(morgan('combined', {'stream': logger.stream}));
};
