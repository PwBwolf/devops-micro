'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    config = require('../../server/common/setup/config');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);

var cj = require('../../server/common/services/cj');

cj.exportCjAccounts(process.argv[2], process.argv[3], function (err) {
    if (err) {
        logger.logError('adminCLI - exportCjBatchFile - export failed');
        process.exit(1);
    } else {
        logger.logInfo('adminCLI - exportCjBatchFile - export completed');
        process.exit(0);
    }
});
