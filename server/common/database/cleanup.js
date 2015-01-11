'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose'),
    Q = require('q'),
    config = require('../config/config'),
    modelsPath = '../models',
    db = mongoose.connect(config.db);

require('../config/models')(modelsPath);

function cleanupCollection(name) {
    var def = Q.defer();
    var model = mongoose.model(name);
    model.collection.remove(function(err) {
        if(err) {
            def.reject();
        } else {
            def.resolve();
        }
    });
    return def.promise;
}

function cleanup() {
    if(config.cleanup) {
        var cleanupPromises = [];
        for(var i = 0; i < config.cleanup.length; i++) {
            cleanupPromises.push(cleanupCollection(config.cleanup[i]));
        }

        Q.all(cleanupPromises).then(function(){
            console.log('Cleanup Successful!');
            process.exit();
        }, function(err) {
            console.log('Something went wrong during cleanup:', err);
        });
    } else {
        console.log('Cleanup not allowed or not configured for this environment! This incident will be reported');
    }
}

cleanup();
