'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Lets load the mongoose module in our program
var config = require('../../common/setup/config');
var mongoose = require('mongoose');
var graceNote = require('../../common/services/grace-note');
var date = require('../../common/services/date');
var logger = require('../../common/setup/logger');
var _ = require('../../node_modules/lodash/lodash');

require('../../common/models/channel');

var dbYip = mongoose.createConnection(config.db);
var Channel = dbYip.model('Channel');

var daysRetrieve = process.argv[2];
var daysKeep = process.argv[3];

if(daysRetrieve > 14 || daysRetrieve === undefined) {
    daysRetrieve = 14;
} else if (daysRetrieve < 0) {
    daysRetrieve = 1;
}	

if(daysKeep < 0 || daysKeep === undefined) {
    daysKeep = 5;
}

var now = new Date();
var startTime = date.isoDate(now);
logger.logInfo(startTime);

var temp = new Date();
temp.setDate(temp.getDate() - daysKeep);
//temp.setMinutes(temp.getMinutes() - 30);
var startTimeDB = date.isoDate(temp);

now.setDate(now.getDate() + daysRetrieve);
var endTime = date.isoDate(now);

logger.logInfo('endTime '+endTime);

var stationIDs = [];

Channel.find({}, function(err, channels) {
    if(err) {
        logger.logError('channel-guide - Channel.find error: '+err);
    } else {
        logger.logInfo('Channel.find documents found in db: '+channels.length);
        for(var i = 0; i < channels.length; i++) {
            stationIDs.push({stationid: channels[i].stationId, dbid: channels[i]._id});
            logger.logInfo(stationIDs[i]);
        }
        
        getChannelGuide(channels);
    }
});

setTimeout(function() {
    process.exit();
}, 150000);

function getChannelGuide(channelDB) {
    graceNote.getChannelList(function (err, data) {
        if (err) {
            logger.logError('channel-guide - getChannelGuide error: '+err);
        } else {
            logger.logInfo(data.length);
            
            // save channel
            for(var j = 0; j < data.length; j++) {
                var isNewChannel = newChannel(data[j], stationIDs);
                if(isNewChannel.bNew) {
                    logger.logInfo('getChannelGuide new channel found, save to db');
                    saveChannel(data[j]);
                } else {
                    logger.logInfo('getChannelGuide channel exists in db with index '+isNewChannel.index+', update db');
                    //logger.logInfo(data[j]);
                    updateChannel(channelDB[isNewChannel.index], data[j], startTimeDB);
                }
            }
        }

    });
}

function newChannel(data, stationIDs) {
    var channel = {bNew: true, index: null};
    if(stationIDs === undefined) {
        return channel;
    }

    _.find(stationIDs, function(item, index) {
        if( item.stationid == data.stationId) {
            channel.bNew = false;
            channel.index = index;
            return channel;
        }
    });
    return channel;
}

function updateChannel(channel, dataGN, startTimeDB) {
    graceNote.getChannelGuide(dataGN.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('channel-guide - updateChannel error: '+err);
        } else {
        
            logger.logInfo('updateChannel program length retrieved from gracenote: '+channel.airings.length);
            
            var count = 0;
            for(var j = 0; j < channel.airings.length; j++) {
                if(channel.airings[j].startTime < startTimeDB) {
                    count++;
                } else {
                    break;	
                }
            }
            logger.logInfo('updateChannel old programs dropped off from channel: '+count);
    
            channel.airings.splice(0, count);
            
            var index = 0;
            for(var i = 0; i < channel.airings.length; i++) {
                if(data[0].airings[0].startTime === channel.airings[i].startTime) {
                    index = i;
                    break;
                }
            }
            
            if(channel.airings.length > 0 && index == 0) {
                for(i = 0; i < channel.airings.length; i++) {
                    if(data[0].airings[0].startTime > channel.airings[i].endTime) {
                        index++; 
                    }
                }
            }
                
            if(channel.airings.length > 0 && index != channel.airings.length) {
                channel.airings.splice(index, channel.airings.length - index);
            }
            
            logger.logInfo('updateChannel program left before adding programs from gracenote: '+channel.airings.length);
            
            for(i = 0; i < data[0].airings.length; i++) {
                logger.logInfo('updateChannel push program into channel ');
                channel.airings.push(data[0].airings[i]);
                channel.airings[channel.airings.length-1].startTime = date.isoDate(new Date(data[0].airings[i].startTime));
                channel.airings[channel.airings.length-1].endTime = date.isoDate(new Date(data[0].airings[i].endTime));
            }
    
            logger.logInfo('updateChannel program length in total: '+channel.airings.length);
    
            channel.save(function (err) {
                if (err) {
                    logger.logError('updateChannel channel.save error: '+err);
                } else {
                    logger.logInfo('updateChannel channel updated successfully');
                }
            });
        }
    });
}

function saveChannel(channel) {
    graceNote.getChannelGuide(channel.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('channel-guide graceNote.getChannelGuide error: '+err);
        } else {
            //Lets create a new user
            var newChannel = new Channel(data[0]);
            logger.logInfo('save new channel start');
            logger.logInfo('program length in total: '+data[0].airings.length);
            
            for(var i = 0; i < newChannel.airings.length; i++) {
                newChannel.airings[i].startTime = date.isoDate(new Date(newChannel.airings[i].startTime));
                newChannel.airings[i].endTime = date.isoDate(new Date(newChannel.airings[i].endTime));
            }
            //Lets save it
            newChannel.save(function (err) {
                if (err) {
                    logger.logError('channel-guide newChannel.save error: '+err);
                } else {
                    logger.logInfo('save new channel successfully:');
                }
            });
        }
    });
}