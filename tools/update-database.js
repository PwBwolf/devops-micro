process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var fs = require('../server/node_modules/fs-extended');

var log_file = fs.createWriteStream(__dirname + '/update-database.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) {
  log_file.write(d + '\n');
  log_stdout.write(d + '\n');
};

var config = require('../server/common/config/config');

var mongoose = require('../server/node_modules/mongoose');
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../server/common/config/models')(modelsPath);

var Users = mongoose.model('User');

Users.update({"activated": true}, { $set: { "status": "active"}}, {upsert: false, multi: true}, function(err, result) {
    if(err) {
        console.log("There was an error while setting status: active, " + err);
    } else {
        console.log("Number of documents updated with status active: " + result);
        Users.update({ "activated" :{ "$exists" : false }} , { $set: { "status": "registered"}}, {upsert: false, multi: true}, function(err, result) {
            if(err) {
                console.log("There was an error while setting status: registered, " + err);
            } else {
                console.log("Number of documents updated with status registered: " + result);
            }
            process.exit(0);
        });
    }
});
