'use strict';

var xmlrpc = require('xmlrpc');

login('achinth+2349@gmail.com', '1459513060000', function (err, sessionId) {
    if (err) {
        process.exit(1);
    } else {
        getCustomerInfo(sessionId, function (err) {
            if(err) {
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    }
});

function login(username, password, callback) {
    var client = xmlrpc.createClient('http://172.16.10.5:8080/');
    client.methodCall('FS.ClientAPI_XMLRPC.login', [
        'email', username,
        'password', password,
        'domain', 'yiptv.com'
    ], function (error, response) {
        if (error) {
            console.log('billing - login - error in login 1');
            console.log(error);
            callback(error);
        } else {
            if (response.error) {
                console.log('billing - login - error in login 2');
                console.log(response.error);
                callback(response.error);
            } else {
                console.log('billing - login - response');
                console.log(response);
                callback(null, response.session_id);
            }
        }
    });
}

function getCustomerInfo(sessionId, callback) {
    var client = xmlrpc.createClient('http://172.16.10.5:8080/');
    client.methodCall('FS.ClientAPI_XMLRPC.skin_info',
        [
            'session_id', sessionId
        ], function (err, response) {
            if (err) {
                console.log('billing - getCustomerInfo - error in getting customer info 1');
                console.log(err);
                callback(err);
            } else {
                if (response.error) {
                    console.log('billing - getCustomerInfo - error in getting customer info 2');
                    console.log(response.error);
                    callback(response.error);
                } else {
                    console.log('billing - getCustomerInfo - response');
                    console.log(response);
                    callback(null);
                }
            }
        }
    );
}
