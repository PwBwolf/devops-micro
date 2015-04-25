'use strict';

var morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function (app, logger) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ type: 'application/*+json' }));
    app.use(methodOverride());
    app.use(morgan('combined', { 'stream': logger.stream }));
};
