'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('../../../server/node_modules/express');
var logger = require('../../../server/common/setup/logger');
var port = process.env.PORT || 8585;
var app = module.exports = express();

var views = __dirname;
require('./router/main')(app, views);

app.use(express.static('services'));
app.use(express.static('controllers'));
app.use(express.static('../../../client'));
app.use(express.static('js'));
app.use(express.static('views'));

var server=app.listen(port,function () {
    logger.logInfo('server is running on port '+port);
});
