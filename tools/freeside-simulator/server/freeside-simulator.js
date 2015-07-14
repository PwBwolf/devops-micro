process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var xmlrpc = require('../../../server/node_modules/xmlrpc');
var simulatorConfig = require('../config/simulator-config');
var logger = require('../../../server/common/setup/logger');

var server = xmlrpc.createServer(simulatorConfig.serverOptions, verbose = true);

server.on('FS.ClientAPI_XMLRPC.new_customer_minimal', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.new_customer_minimal'+ ' is called');
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }
    
    simulatorConfig.serverContents.customNum = Date.now()/1000|0;
    simulatorConfig.serverContents.sessionID = 10;
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.newCustomer === true? null:'freeside simulator - createCustomer - error in creating customer 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - createCustomer - error in creating customer 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.login', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.login'+ ' is called');
    simulatorConfig.serverContents.sessionID = 10;
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.logIn === true? null:'freeside simulator - login - error in login 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - login - error in login 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.edit_info', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.edit_info'+ ' is called');
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.editInfo === true? null:'freeside simulator - updateCustomer - error in updating customer 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - updateCustomer/updateCreditCard/updateAddress - error in edit info 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.order_pkg', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.order_pkg'+ ' is called');
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.orderPackage === true? null:'freeside simulator - orderPackage - error in ordering package 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - orderPackage - error in ordering package 1');
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.renew_info', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.renew_info'+ ' is called');
    simulatorConfig.serverContents.dates[0].bill_date = Date.now()/1000|0;
    simulatorConfig.serverContents.error =  simulatorConfig.ctrlConfig.renewInfo === true? null:'freeside simulator - getBillingDate - error in getting billing date 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - getBillingDate - error in getting billing date 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.cancel_pkg', function (error, params, fnClient) {
    logger.logInfo('FS.ClientAPI_XMLRPC.cancel_pkg'+ ' is called');
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.cancelPackage === true? null:'freeside simulator - cancelPackage - error in canceling package 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - cancelPackage - error in canceling package 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

server.on('FS.ClientAPI_XMLRPC.list_pkgs', function (error, params, fnClienet) {
    logger.logInfo('FS.ClientAPI_XMLRPC.list_pkgs'+ ' is called');
    simulatorConfig.serverContents.customPackage = 'packages';
    simulatorConfig.serverContents.error = simulatorConfig.ctrlConfig.listPackages === true? null:'freeside simulator - getPackages - error in getting packages 2';
    
    fnClient(simulatorConfig.config === true? null:'freeside simulator - getPackages - error in getting packages 1', simulatorConfig.serverContents);
    logger.logInfo('input params: '+params);
});

logger.logInfo('XML-RPC server listening on port 9090');