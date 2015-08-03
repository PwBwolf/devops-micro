'use strict';

//Lets load the mongoose module in our program
var mongoose = require('../../../../server/node_modules/mongoose');
var graceNote = require('../services/grace-note');
var async = require('../../../../server/node_modules/async');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');

require('../models/program');
require('../models/channel');

var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@localhost/yiptv');
var Program = dbYip.model('Program');
var Channel = dbYip.model('Channel');

var nowTime = new Date();
var startTime = date.isoDate(nowTime);
logger.logInfo(startTime);

var temp = new Date();
//temp.setDate(temp.getDate() - 5);
temp.setMinutes(temp.getMinutes() - 30);
var startTimeDB = date.isoDate(temp);

nowTime.setHours(nowTime.getHours() + 5);
var endTime = date.isoDate(nowTime);
var stationID = '';
//var stationID = '44448';

var stationIDs = [];

module.exports = {
	getChannelGuide: function (req, res) {
		async.waterfall([
			function(callback) {
				Channel.find({}, function(err, channelsDB) {
					if(err) {
						logger.logInfo('find error: '+err);
						callback(err);
					} else {
						logger.logInfo('documents found in channelsDB: '+channelsDB.length);
						
						res.json({channelsDB: channelsDB});
						callback(null, channelsDB);
					}
				});
			},
			/*
			function(channelsDB, callback) {
				graceNote.getChannelGuide(stationID, startTime, endTime, function (err, data) {
					if (err) {
						logger.logInfo(err);
						return res.status(500).end();
					}

					logger.logInfo(data.length);
					//console.log(data[0]);
					
					for(var i = 0; i < channelsDB.length; i++) {
						stationIDs.push({stationID: channelsDB[i].stationId, dbID: channelsDB[i]._id});
						logger.logInfo(JSON.parse(JSON.stringify(stationIDs[i])));
					}
					
					// old channels shoud be removed from DB
					var oldchannels = [];
					for(var k = 0; k < channelsDB.length; k++) {
						var isChannelExist = false;
						for(var m = 0; m < data.length; m++) {
							if(channelsDB[k].stationId === data[m].stationId) {
								isChannelExist = true;
								break;
							}
						}
						// channel does not exist
						if(isChannelExist === false) {
							channelsDB[k].remove();
							
							Channel.remove({ _id: stationIDs[k].dbID }, function (err) {
  								if (err) {
									logger.logError('could not remove channel from DB:'+err);
								} else {
  									// removed!
									logger.logInfo('remove channel not exist with index: '+k);
								}
							});
							stationIDs[k].remove();
							k--;
						}
					}
					
					// save channel
					for(var j = 0; j < data.length; j++) {
						var isNewChannel = newChannel(data[j], stationIDs);
						if(isNewChannel.new) {
							logger.logInfo('new channel found, save to db');
							saveChannel(Channel, data[j], channelsDB);
						} else {
							logger.logInfo('channel exists in db with index ' + isNewChannel.index + ', update db');
							//logger.logInfo(data[j]);
							updateChannel(channelsDB[isNewChannel.index], data[j], startTimeDB);
						}
					}
					res.json({channelsDB: channelsDB});
					logger.logInfo('pass channel info to client');
					//console.log(channelsDB);
					//console.log(channelsDB[0].airings[0].program);
					//res.json({channelsB: channelsDB[0].airings[0].program.title});
					callback(err, data);
				})
			}*/

		], function (err) {
			if (err) {
				logger.logError(err);
                return res.status(500).end();
            } else {
				logger.logInfo('get channel guide, return!');
            }
        });
	}
};

function newChannel(data, stationIDs) {
	var channel = {new: true, index: null};
	if(stationIDs === undefined) {
		logger.logInfo('first time run');
		return channel;
	}
		
	for( var i = 0; i < stationIDs.length; i++) {
		if(data.stationId === stationIDs[i].stationID) {
			channel.new = false;
			channel.index = i;
			return channel;	
		}
	}
	return channel;
}

function saveProgram(Program, data) {
	//Lets create a new user
	var program = new Program(data);

	//Lets save it
	program.save(function (err, userObj) {
    	if (err) {
        	logger.logInfo(err);
    	} else {
        	logger.logInfo('saved program successfully:', userObj);
    	}
	});
}

function updateChannel(channel, data, startTimeDB) {
	logger.logInfo('airings length: '+channel.airings.length);
	logger.logInfo('airings startTime in db: '+channel.airings[0].startTime+' VS airings startTime frome gracenote: '+data.airings[0].startTime);

	var count = 0;
	for(var j = 0; j < channel.airings.length; j++) {
		if(channel.airings[j].startTime < startTimeDB) {
			count++;
		} else {
			break;	
		}
	}
	logger.logInfo('old programs dropped off from channel: '+count);		
	channel.airings.splice(0, count);
	
	var newLength = channel.airings.length;
	for(var i = 0; i < data.airings.length; i++) {
		if(newLength > 0) {
		   if(data.airings[i].startTime > channel.airings[newLength-1].startTime) {
				logger.logInfo('--push program into channel: ');
				channel.airings.push(data.airings[i]);
			}
		} else {
			logger.logInfo('--push program into channel: ');
			channel.airings.push(data.airings[i]);
		}
	}
	
	logger.logInfo('airings length: '+channel.airings.length);
	
	channel.save(function (err, userObj) {
    	if (err) {
        	logger.logInfo('updateChannel - save got error: '+err);
    	} else {
        	//logger.logInfo('update channel successfully:', userObj);
			logger.logInfo('update channel successfully');
    	}
	});
}

function saveChannel(Channel, data, channelsDB) {
	//Lets create a new user
	var channel = new Channel(data);
	logger.logInfo('--save channel start--');
	logger.logInfo('airings in the channel: '+data.airings.length);
	//console.log(data);
	channelsDB.push(data);
	//console.log(channelsDB[0]);
	//Lets save it
	channel.save(function (err, userObj) {
    	if (err) {
        	logger.logInfo(err);
    	} else {
        	//logger.logInfo('saved channel successfully:', userObj);
			logger.logInfo('saved channel successfully:');
    	}
	});
}