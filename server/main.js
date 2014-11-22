'use strict';

var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    logger = require('mean-logger'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    port = process.env.PORT || config.port,
    app = module.exports = express(),
    modelsPath = config.root + '/server/models';

require('./config/models')(modelsPath);
require('./config/express')(app, passport, env);
require('./config/passport')(passport);
require('./config/routes')(app);

http.createServer(app).listen(port, function () {
    console.log('YipTV server listening on port ' + port);
});

logger.init(app, passport, mongoose);
