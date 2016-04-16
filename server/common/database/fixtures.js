'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose'),
    crawler = require('walk'),
    fs = require('fs-extended'),
    Q = require('q'),
    config = require('../setup/config'),
    modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function () {
    require('../setup/models')(modelsPath);
    var models = {
        'Countries': mongoose.model('Country'),
        'States': mongoose.model('State')
    };

    function processFixture(fqn) {
        var def = Q.defer();
        var collectionContent = fs.readJSONSync(__dirname + '/' + fqn);
        if (models[collectionContent.type]) {
            models[collectionContent.type].collection.remove(function (err) {
                if (err) {
                    console.log('Could not delete ' + collectionContent.type + '. File not processed');
                    def.reject();
                } else {
                    models[collectionContent.type].collection.insert(collectionContent.docs, {}, function (err) {
                        if (err) {
                            console.log('Something went wrong when inserting ' + fqn + ' to the database!');
                            def.reject();
                        }
                        console.log('Successfully inserted ' + fqn + ' to the database!');
                        def.resolve();
                    });
                }
            });
        }
        return def.promise;
    }

    var options = {
        followLinks: false,
        listeners: {
            files: function (root, files) {
                var fixturePromises = [];
                for (var i = 0; i < files.length; i++) {
                    if (files[i].name.indexOf('.json') > -1) {
                        fixturePromises.push(processFixture(files[i].name));
                    }
                }
                Q.all(fixturePromises).then(function () {
                    process.exit();
                }, function (err) {
                    console.log('Something went wrong while inserting fixtures:', err);
                });
            },
            errors: function (root, nodeStatsArray, next) {
                next();
            }
        }
    };
    crawler.walkSync(__dirname, options);
});
