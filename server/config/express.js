'use strict';

var express = require('express'),
    morgan = require('morgan'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser');

module.exports = function (app, passport) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    if (config.environment === 'development') {
        app.use(express.static(config.root + '/client'));
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }
    app.use(passport.initialize());
    app.use(passport.session());
};
