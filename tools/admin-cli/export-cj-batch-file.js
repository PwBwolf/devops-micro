'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var cj = require('../../server/common/services/cj'),
    logger = require('../../server/common/setup/logger');

cj.exportCjAccounts(process.argv[2], process.argv[3], function (err) {
    if (err) {
        logger.logError('adminCLI - exportCjBatchFile - export failed');
        process.exit(1);
    } else {
        logger.logInfo('adminCLI - exportCjBatchFile - export completed');
        process.exit(0);
    }
});
