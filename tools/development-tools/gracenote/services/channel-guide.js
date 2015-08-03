'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Lets load the mongoose module in our program
var mongoose = require('../../../../server/node_modules/mongoose');
var graceNote = require('./grace-note');
var async = require('../../../../server/node_modules/async');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');

require('../models/program');
require('../models/channel');

var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@localhost/yiptv');
var Program = dbYip.model('Program');
var Channel = dbYip.model('Channel');

var now = new Date();
var startTime = date.isoDate(now);
logger.logInfo(startTime);

var temp = new Date();
temp.setDate(temp.getDate() - 5);
//temp.setMinutes(temp.getMinutes() - 30);
var startTimeDB = date.isoDate(temp);

var tempInit = new Date();
tempInit.setHours(tempInit.getHours() + 2);
var endTimeInit = date.isoDate(tempInit);

now.setDate(now.getDate() + 15);
var endTime = date.isoDate(now);

logger.logInfo('endTime '+endTime);
var stationID = '';
//var stationID = '44448';

var stationIDs = [];

Channel.find({}, function(err, channels) {
	if(err) {
		logger.logInfo('find error: '+err);
	} else {
		logger.logInfo('documents found in Channels: '+channels.length);
		for(var i = 0; i < channels.length; i++) {
			stationIDs.push({stationID: channels[i].stationId, dbID: channels[i]._id});
			logger.logInfo(JSON.parse(JSON.stringify(stationIDs[i])));
		}
		
		getChannelGuide(graceNote, stationID, channels);
	}
});


function getChannelGuide(graceNote, stationId, channelDB) {
	graceNote.getChannelGuide(stationId, startTime, endTimeInit, function (err, data) {
    	if (err) {
        	logger.logInfo(err);
        	return res.status(500).end();
    	}
	
		logger.logInfo(data.length);
		
		/*
		// old channels shoud be removed from DB
		var oldchannels = [];
		for(var k = 0; k < channelDB.length; k++) {
			console.log('channels length: '+channelDB.length + ' index k: '+ k);
			var isChannelExist = false;
			for(var m = 0; m < data.length; m++) {
				if(channelDB[k].stationId === data[m].stationId) {
					isChannelExist = true;
					break;
				}
			}
			// channel does not exist
			if(isChannelExist === false) {
				channelDB.splice(k, 1);
				console.log('stationIDs: index '+k+' _id '+stationIDs[k].dbID);
				var dbID = stationIDs[k].dbID;
				
				Channel.remove({ _id: stationIDs[k].dbID }, function (err) {
					if (err) {
						logger.logError('could not remove channel from DB:'+err);
					} else {
						// removed!
						logger.logInfo('remove channel not exist with index: '+k);
					}
				});
				stationIDs.splice(k, 1);
				k--;
			}
		}
		*/
		// save channel
    	for(var j = 0; j < data.length; j++) {
			var isNewChannel = newChannel(data[j], stationIDs);
			if(isNewChannel.new) {
				logger.logInfo('new channel found, save to db');
				saveChannel(Channel, data[j]);
			} else {
				logger.logInfo('channel exists in db with index '+isNewChannel.index+', update db');
				//logger.logInfo(data[j]);
				updateChannel(channelDB[isNewChannel.index], data[j], startTimeDB);
			}
    	}
	
		// save program
		//for(var i = 0; i < data[0].airings.length; i++) {
			//saveProgram(Program, data[0].airings[i]);
        	//logger.logInfo(data[0].airings[i]);
    	//}
	});
}

function newChannel(data, stationIDs) {
	var channel = {new: true, index: null};
	if(stationIDs === undefined) {
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

function updateChannel(channel, dataGN, startTimeDB) {
	graceNote.getChannelGuide(dataGN.stationId, startTime, endTime, function (err, data) {
    	if (err) {
        	logger.logInfo(err);
        	return res.status(500).end();
    	}
		
		logger.logInfo('airings length: '+channel.airings.length);
		logger.logInfo('airings startTime in db: '+channel.airings[0].startTime+' VS airings startTime frome gracenote: '+data[0].airings[0].startTime);

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

		logger.logInfo('program left: '+channel.airings.length);

		var newLength = channel.airings.length;
		for(var i = 0; i < data[0].airings.length; i++) {
			if(newLength > 0) {
			   if(data[0].airings[i].startTime > channel.airings[newLength-1].startTime) {
					logger.logInfo('--push program into channel: ');
					channel.airings.push(data[0].airings[i]);
				}
			} else {
				logger.logInfo('--push program into channel: ');
				channel.airings.push(data[0].airings[i]);
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
	});
}

function saveChannel(Channel, channel) {
	graceNote.getChannelGuide(channel.stationId, startTime, endTime, function (err, data) {
    	if (err) {
        	logger.logInfo(err);
        	return res.status(500).end();
    	}
		//Lets create a new user
		var newChannel = new Channel(data[0]);
		logger.logInfo('--save channel start--');
		logger.logInfo('airings in the channel: '+data[0].airings.length);

		//Lets save it
		newChannel.save(function (err, userObj) {
			if (err) {
				logger.logInfo(err);
			} else {
				//logger.logInfo('saved channel successfully:', userObj);
				logger.logInfo('saved channel successfully:');
			}
		});
	});
}