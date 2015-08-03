'use strict';

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

module.exports = {
    getChannelGuideAll: function () {
		var now = new Date();
		var startTime = date.isoDate(now);
		logger.logInfo(startTime);

		var temp = new Date();
		//temp.setDate(temp.getDate() - 5);
		temp.setMinutes(temp.getMinutes() - 30);
		var startTimeDB = date.isoDate(temp);

		now.setHours(now.getHours() + 5);
		var endTime = date.isoDate(now);
		//var stationID = '';
		var stationID = '44448';

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
				return channels;
				//return getChannelGuide(stationID, startTime, endTime, stationIDs, channels);
			}
		});
	}
};

function getChannelGuide(stationId, startTime, endTime, stationIDs, channelDB) {
	graceNote.getChannelGuide(stationId, startTime, endTime, function (err, data) {
    	if (err) {
        	logger.logInfo(err);
        	return res.status(500).end();
    	}
	
		logger.logInfo(data.length);

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
		return channelDB;
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

function saveChannel(Channel, data) {
	//Lets create a new user
	var channel = new Channel(data);
	logger.logInfo('--save channel start--');
	logger.logInfo('airings in the channel: '+data.airings.length);
	
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