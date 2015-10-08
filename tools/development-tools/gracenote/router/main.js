'use strict';

var logger = require('../../../../server/common/setup/logger');
var channelGuideCtrl = require('../controllers/channel-guide-controller');
var appCtrl = require('../controllers/app-controller');

module.exports=function(app, root)
{
    app.get('/',function(req, res){
        logger.logInfo('Home page');
        res.sendFile('index.html', {"root": root + '/views'})
    });

    app.get('/metadata/api/get-channel-list', channelGuideCtrl.getChannelList);

    app.get('/metadata/api/get-channel-info', channelGuideCtrl.getChannelInfo);

    app.get('/metadata/api/get-program-detail', channelGuideCtrl.getProgramDetail);

    app.get('/metadata/api/get-app-config', appCtrl.getAppConfig);

    app.get('/metadata/api/get-channel-logo', channelGuideCtrl.getChannelLogo);

    app.get('/metadata/api/get-program-image', channelGuideCtrl.getProgramImage);

    app.get('/about',function(req, res){

        logger.logInfo('About page');
        res.sendFile('about.html', {"root": root + '/views'})
    });
}
