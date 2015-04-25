'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('../common/config/config'),
    logger = require('../common/config/logger'),
    port = process.env.MERCHANT_PORT || config.merchantPort,
    app = module.exports = express(),
    modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb);

require('../common/config/logger');
require('../common/config/models')(modelsPath);
require('./express')(app, logger);
require('./routes')(app);

http.createServer(app).listen(port, function () {
    logger.logInfo('app - merchant gateway server listening on port ' + port);
});
