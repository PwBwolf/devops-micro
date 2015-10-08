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
    app.set('views', config.root + config.clientPath);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({type: 'application/*+json'}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(favicon(config.root + config.clientPath + '/images/favicon.ico'));
    app.use(express.static(config.root + config.clientPath));
    app.use(morgan('combined', {'stream': logger.stream}));
};
