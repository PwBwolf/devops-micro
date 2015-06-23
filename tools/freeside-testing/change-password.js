'use strict';

var xmlrpc = require('xmlrpc');
var client = xmlrpc.createClient('http://172.16.10.5:8080/');
var email = process.argv[2];
var oldPassword = new Date(process.argv[3]).getTime();
var newPassword = new Date(process.argv[4]).getTime();

changePassword(function (err) {
    if (err) {
        process.exit(1);
        console.log(err);
    } else {
        console.log('Password updated');
        process.exit(0);
    }
});

function changePassword(cb) {
    client.methodCall('FS.ClientAPI_XMLRPC.passwd', [
        'username', email,
        'domain', 'yiptv.com',
        'old_password', oldPassword,
        'new_password', newPassword
    ], function (error, value) {
        if (error) {
            console.log('error:', error);
            console.log('req headers:', error.req && error.req._header);
            console.log('res code:', error.res && error.res.statusCode);
            console.log('res body:', error.body);
            cb(error);
        } else {
            console.log('value:', value);
            if (value.error) {
                cb(value.error);
            } else {
                cb(null);
            }
        }
    });
}
