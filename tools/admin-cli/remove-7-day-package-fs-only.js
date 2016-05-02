'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    LineByLineReader = require('line-by-line'),
    mongoose = require('../../server/node_modules/mongoose'),
    modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - remove7DayPackageFsOnly - db connection error 1');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var subscription = require('../../server/common/services/subscription');
        var lr = new LineByLineReader('users.log');
        lr.on('error', function (err) {
            logger.logError(err);
        });

        lr.on('line', function (line) {
            lr.pause();
            logger.logInfo('processing ' + line);
            subscription.removePremiumPackage(line, function (err) {
                if (err) {
                    logger.loggerError('adminCLI - remove7DayPackageFsOnly - error removing premium package ' + err);
                }
                lr.resume();
            })
        });

        lr.on('end', function () {
            logger.logInfo('done');
            process.exit(0);
        });
    }
});
