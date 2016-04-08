'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var cj = require('../../server/common/services/cj'),
    logger = require('../../server/setup/logger');

cj.exportCjAccounts(process.argv[2], process.argv[3], function (err) {
    if (err) {
        logger.logInfo('adminCLI - exportCjBatchFile - export completed');
        process.exit(1);
    } else {
        logger.logError('adminCLI - exportCjBatchFile - error failed');
        process.exit(0);
    }
});
