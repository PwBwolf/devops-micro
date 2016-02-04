'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('../common/setup/config'),
    logger = require('../common/setup/logger'),
    port = process.env.API_SERVER_PORT || config.apiServerPort,
    app = module.exports = express(),
    modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);



require('../common/setup/logger');
require('../common/setup/models')(modelsPath);
require('./express')(app, logger);
require('./routes')(app);

http.createServer(app).listen(port, function () {
    logger.logInfo('apiServer - app - api-server listening on port ' + port);
});
