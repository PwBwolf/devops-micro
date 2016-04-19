'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('../common/setup/config'),
    logger = require('../common/setup/logger'),
    port = process.env.CRM_PORT || config.crmAppPort,
    app = module.exports = express(),
    modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db);

require('../common/setup/models')(modelsPath);
require('./express')(app, logger);
require('./routes')(app);

http.createServer(app).listen(port, function () {
    logger.logInfo('crmApp - app - crm-app listening on port ' + port);
});
