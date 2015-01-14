'use strict';

var config = require('../config/config'),
    logger = require('../../common/config/logger'),
    xmlrpc = require('xmlrpc');

module.exports = {
    createUser: function(firstName, lastName, address1, address2, city, state, zip, country, email, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.new_customer',
            [   'secret', config.freeSideApiKey,
                'agentnum', 1,
                'first', firstName,
                'last', lastName,
                'address1', address1,
                'address2', address2,
                'city', city,
                'state', state,
                'zip', zip,
                'country', country,
                'daytime', telephone,
                'payby', payBy,
                'payinfo', payInfo,
                'paycvv', payCvv,
                'paydate', payDate,
                'payname', payName,
                'invoicelist', email
            ], function (err, response) {
            if (err) {
                logger.logError(JSON.stringify(err));
                callback(err);
            } else {
                if(response.error) {
                    logger.logError(response.error);
                    callback(response.error);
                } else {
                    logger.logInfo(response);
                    callback(null, response.custnum);
                }
            }
        });
    }
};


