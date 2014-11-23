'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/config'),
    logger = require('./config/logger'),
    port = process.env.PORT || config.port,
    app = module.exports = express(),
    modelsPath = config.root + '/server/models',
    db = mongoose.connect(config.db);

require('./config/logger');
require('./config/models')(modelsPath);
require('./config/express')(app, passport, logger);
require('./config/passport')(passport);
require('./config/routes')(app);

http.createServer(app).listen(port, function () {
    console.log('YipTV server listening on port ' + port);
});



