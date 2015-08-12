'use strict';

var logger = require('../../../../server/common/setup/logger');
var channelGuideCtrl = require('../controllers/channel-guide-controller');

module.exports=function(app, root)
{
    app.get('/',function(req, res){
        logger.logInfo('Home page');
        res.sendFile('index.html', {"root": root + '/views'})
    });
    
    app.get('/channellist', channelGuideCtrl.getChannelList);
    
    app.get('/channellist/channel', channelGuideCtrl.getChannelInfo);
    
    app.get('/channellist/channel/program', channelGuideCtrl.getProgramDetail);
    
    app.get('/appconfig', channelGuideCtrl.getAppConfig);
    
    app.get('/about',function(req, res){

        logger.logInfo('About page');
        res.sendFile('about.html', {"root": root + '/views'})
    });
}