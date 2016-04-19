'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/remove-visitor-collection.log', {flags: 'w'});
var logStdOut = process.stdout;

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

function removeCollection(name, cb) {
    MongoClient.connect(config.db, function (err, db) {
        var collection = db.collection(name);
        collection.drop(function (err, res) {
            if (err) {
                console.log('Error dropping collection ' + name + ': ' + err);
            } else {
                console.log('Successfully dropped collection ' + name + ': ' + res);
            }
            cb(err);
        });
    });
}

async.waterfall([
    function (callback) {
        removeCollection('CmsAds', function () {
            callback();
        });
    },
    function (callback) {
        removeCollection('CmsCategories', function () {
            callback();
        });
    },
    function (callback) {
        removeCollection('CmsChannels', function () {
            callback();
        });
    }
], function () {
    process.exit(0);
});




