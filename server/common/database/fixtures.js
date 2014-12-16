var mongoose = require('mongoose'),
    crawler  = require('walk'),
    fs       = require('fs-extended');

var models = {
    "countries": mongoose.model('Country'),
    "app-config": mongoose.model('AppConfig')
}

module.exports = function() {
    var options = {
        followLinks: false,
        listeners: {
            file: function (root, fileStats, next) {
                if(fileStats.name.indexOf('.json') > -1) {
                    var collectionContent = fs.readJSONSync(__dirname + '/' + fileStats.name);
                    if(models[collectionContent.type]) {
                        models[collectionContent.type].collection.remove(function(err, result){
                            if(err) {
                                console.log('Could not delete '+collectionContent.type+' first...file not processed');
                                next();
                            } else {
                                models[collectionContent.type].collection.insert(collectionContent.docs, {}, function(err, docs) {
                                    if(err) {
                                        console.log('Something went wrong when inserting ' + fileStats.name + ' to the database!');
                                    }
                                    console.log('Successfully inserted ' + fileStats.name + ' to the database!');
                                    next();
                                });
                            }
                        });

                    }

                }

            },
            errors: function (root, nodeStatsArray, next) {
                next();
            }
        }
    };

    // create a route using the crawler
    var route  = crawler.walkSync('../common/database', options);
}
