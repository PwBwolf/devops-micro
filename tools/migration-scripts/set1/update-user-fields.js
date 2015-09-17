'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/update-user-fields.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Users = mongoose.model('User');

Users.update({activated: {$exists: true}}, {$unset: {activated: ''}}, {upsert: false, multi: true}, function (err, result) {
    if (err) {
        console.log('Error updating users: ' + err);
    } else {
        console.log('Number of users updated: ' + result);
    }
    process.exit(0);
});




