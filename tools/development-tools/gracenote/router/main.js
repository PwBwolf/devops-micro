'use strict';

var logger = require('../../../../server/common/setup/logger');
var channelGuideCtrl = require('../controllers/channel-guide-controller');

module.exports=function(app, root)
{
	app.get('/',function(req, res){
		logger.logInfo('Home page');
		res.sendFile('index.html', {"root": root + '/views'})
	});
	
	app.get('/channelguide', channelGuideCtrl.getChannelGuide);
	
	app.get('/about',function(req, res){

		logger.logInfo('About page');
		res.sendFile('about.html', {"root": root + '/views'})
	});
}