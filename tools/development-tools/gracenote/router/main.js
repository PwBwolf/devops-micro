'use strict';

var logger = require('../../../../server/common/setup/logger');
var channelGuideCtrl = require('../controllers/channel-guide-controller');

module.exports=function(app, root)
{
    app.get('/',function(req, res){
        logger.logInfo('Home page');
        res.sendFile('index.html', {"root": root + '/views'})
    });
    
    app.get('/metadata/api/channellist', channelGuideCtrl.getChannelList);
    
    app.get('/metadata/api/channelinfo', channelGuideCtrl.getChannelInfo);
    
    app.get('/metadata/api/programdetail', channelGuideCtrl.getProgramDetail);
    
    app.get('/appconfig', channelGuideCtrl.getAppConfig);
    
    app.get('/about',function(req, res){

        logger.logInfo('About page');
        res.sendFile('about.html', {"root": root + '/views'})
    });
}