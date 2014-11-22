'use strict';

var express = require('express'),
    morgan = require('morgan'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon');

module.exports = function (app, passport) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    app.set('views', config.root + '/client');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(favicon(config.root + '/client/images/favicon.ico'));
    app.use(express.static(config.root + '/client'));
    if (config.environment === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }
    app.use(passport.initialize());
    app.use(passport.session());
};
