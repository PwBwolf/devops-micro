'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    billing = require('../../server/common/services/billing'),
    mongoose = require('../../server/node_modules/mongoose'),
    fs = require('fs-extended'),
    async = require('async'),
    logErrorFile = fs.createWriteStream(__dirname + '/login-error.log', {flags: 'w'}),
    logSuccessFile = fs.createWriteStream(__dirname + '/login-success.log', {flags: 'w'}),
    logStdOut = process.stdout;

console.logError = function (data) {
    logErrorFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

console.logSuccess = function (data) {
    logSuccessFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - freesideLoginReport - db connection error');
    } else {

        require('../../server/common/setup/models')(modelsPath);
        var User = mongoose.model('User');
        var startTime = new Date();
        User.find({$or: [{status: 'registered'}, {status: 'active'}]}).populate('account').exec(function (err, users) {
            if (err) {
                console.logError('error fetching users');
                console.logError(err);
                process.exit(1);
            } else if (!users || users.length === 0) {
                console.logError('no users found!');
                process.exit(0);
            } else {
                var errorCount = 0;
                var successCount = 0;
                async.eachSeries(
                    users,
                    function (user, callback) {
                        billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err) {
                            if (err) {
                                console.logError('error logging into freeside for user ' + user.email);
                                console.logError(err);
                                errorCount++;
                            } else {
                                console.logSuccess('successfully logged into freeside for user ' + user.email);
                                successCount++;
                            }
                            callback();
                        });
                    },
                    function () {
                        setTimeout(function () {
                            var endTime = new Date();
                            var totalTime = (endTime.getTime() - startTime.getTime()) / 1000;
                            console.log('start time: ' + startTime);
                            console.log('end time: ' + endTime);
                            console.log('total time in seconds: ' + totalTime);
                            console.log('time per user: ' + totalTime / users.length);
                            console.log('total users: ' + users.length);
                            console.log('total users who successfully logged into freeside: ' + successCount);
                            console.log('total users who failed to log into freeside: ' + errorCount);
                            process.exit(0);
                        }, 5000);
                    }
                );
            }
        });
    }
});


