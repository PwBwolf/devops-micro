'use strict';

// we default to 'production' if the actual environment value is not set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var express = require('express');
var config = require('./config');
var port = process.env.PORT || config.port;
var app = module.exports = express();
var server = null;

if (config.environment === 'production') {
    /* uncomment and configure once we have the SSL certificates */
    //var keys = {
    //    A : fs.readFileSync('/etc/nginx/ssl/airfi_aero.key')
    //};
    //var certs = {
    //    A : fs.readFileSync('/etc/nginx/ssl/airfi_aero.crt'),
    //    B : fs.readFileSync('/etc/nginx/ssl/AddTrustExternalCARoot.crt'),
    //    C : fs.readFileSync('/etc/nginx/ssl/COMODOHigh-AssuranceSecureServerCA.crt'),
    //    D : fs.readFileSync('/etc/nginx/ssl/InstantSSL.ca-bundle')
    //};
    //var options = {
    //    key  :  keys.A,
    //    cert :  certs.A,
    //    ca   :  certs.D
    //};
    //server = require('https')(options, app);
    server = require('http')(app);
} else {
    app.use(express.static(config.root + '/client'));
    server = require('http')(app);
}

require('./express')(app);
require('./routes')(app);

server.listen(port, function () {
    console.log('YiPTV Server listening on port ' + port);
});
