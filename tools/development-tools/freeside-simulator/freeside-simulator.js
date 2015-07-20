'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var xmlrpc = require('../../../server/node_modules/xmlrpc');
var simulatorConfig = require('./simulator-config');
var logger = require('../../../server/common/setup/logger');

var server = xmlrpc.createServer(simulatorConfig.serverOptions);

server.on('FS.ClientAPI_XMLRPC.new_customer_minimal', function (error, params, cb) {
    
    logger.logInfo('FS.ClientAPI_XMLRPC.new_customer_minimal'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if( params.first === null || params.last === null || params.address1 === null || params.city === null || params.state === null || params.zip === null || params.country === null || params.invoicing_list === null || params._password === null || params.daaytime === null || params.payby === null || params.payinfo === null || params.paydate || params.paycvv === null || params.payname === null ) {
            simulatorConfig.serverContents1.newCustomer.error = 'freeside simulator - createCustomer - error in creating customer 2 - input error';
        } else {
            simulatorConfig.serverContents1.newCustomer.custnum = (new Date()).getTime()/1000|0;
            simulatorConfig.serverContents1.newCustomer.session_id = 10;
            simulatorConfig.serverContents1.newCustomer.error = null;
        }
    
        cb(null, simulatorConfig.serverContents1.newCustomer);
    }
});

server.on('FS.ClientAPI_XMLRPC.login', function (error, params, cb) {
    
    logger.logInfo('FS.ClientAPI_XMLRPC.login'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if(params.email === null || params.password === null) {
            simulatorConfig.serverContents1.logIn.error = 'freeside simulator - login - error in login 2 input error'
        } else {
            simulatorConfig.serverContents1.logIn.session_id = 10;
            simulatorConfig.serverContents1.logIn.error = null;
        }
        
        cb(null, simulatorConfig.serverContents1.logIn);
    }
});

server.on('FS.ClientAPI_XMLRPC.edit_info', function (error, params, cb) {
    
    logger.logInfo('FS.ClientAPI_XMLRPC.edit_info'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error)
    {
        cb(error);
        logger.logInfo(error);
    } else {
        if(params.session_id === null) {
            simulatorConfig.serverContents1.editInfo.error = 'freeside simulator - updateCustomer/updateCreditCard/updateAddress - input error';
        } else {
            simulatorConfig.serverContents1.editInfo.error = null;
        }
        
        cb(null, simulatorConfig.serverContents1.editInfo);
    }
});

server.on('FS.ClientAPI_XMLRPC.order_pkg', function (error, params, cb) {
    
    logger.logInfo('FS.ClientAPI_XMLRPC.order_pkg'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if(params.session_id === null || params.pkgpart === null) {
            simulatorConfig.serverContents1.orderPackage.error = 'freeside simulator - orderPackage - input error';
        } else {
            simulatorConfig.serverContents1.orderPackage.error = null;
        }
        
        cb(null, simulatorConfig.serverContents1.orderPackage);
    }
});

server.on('FS.ClientAPI_XMLRPC.renew_info', function (error, params, cb) {
    logger.logInfo('FS.ClientAPI_XMLRPC.renew_info'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if(params.session_id === null) {
            simulatorConfig.serverContents1.renewInfo.error = 'freeside simulator - getBillingDate - input error';	
        } else {
            simulatorConfig.serverContents1.renewInfo.dates[0].bill_date = (new Date()).getTime()/1000|0;
            simulatorConfig.serverContents1.renewInfo.error =  null;
        }
        
        cb(null, simulatorConfig.serverContents1.renewInfo);
    }
});

server.on('FS.ClientAPI_XMLRPC.cancel_pkg', function (error, params, cb) {
    logger.logInfo('FS.ClientAPI_XMLRPC.cancel_pkg'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if(params.session_id === null || params.pkgnum === null) {
            simulatorConfig.serverContents1.cancelPackage.error = 'freeside simulator - cancelPackage - input error';
        } else {
            simulatorConfig.serverContents1.cancelPackage.error = null;
        }
        
        cb(null, simulatorConfig.serverContents1.cancelPackage);
    }
});

server.on('FS.ClientAPI_XMLRPC.list_pkgs', function (error, params, cb) {
    logger.logInfo('FS.ClientAPI_XMLRPC.list_pkgs'+ ' is called');
    logger.logInfo('input params: '+params);
    
    if(error) {
        cb(error);
        logger.logInfo(error);
    }
    else {
        if(params.session_id === null) {
            simulatorConfig.serverContents1.listPackages.error = 'freeside simulator - getPackages - input error';
        } else {
            simulatorConfig.serverContents1.listPackages.cust_pkg = 'packages';
            simulatorConfig.serverContents1.listPackages.error = null;
        }
        
        cb(null, simulatorConfig.serverContents1.listPackages);
    }
});

logger.logInfo('freeside simulator XML-RPC server listening on port 9090');