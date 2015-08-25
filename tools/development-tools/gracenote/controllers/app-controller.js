'use strict';

var config = require('../../../../server/common/setup/config');

module.exports = {
    getAppConfig : function (req, res) {
        
        var appConfig = {
            graceNoteImageUrl: config.graceNoteImageUrl
        };
        return res.json(appConfig);
    }
};
