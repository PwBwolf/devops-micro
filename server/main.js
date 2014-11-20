'use strict';

// we default to 'development' if the actual environment value is not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config');
var port = process.env.PORT || config.port;
var app = express();
var server = null;

if (config.environment === 'development') {
    app.use(express.static(config.root + '/client'));
}

require('./express')(app);
require('./routes')(app);

app.listen(port, function () {
    console.log('YiPTV Server listening on port ' + port);
});
