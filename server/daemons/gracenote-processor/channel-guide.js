'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Lets load the mongoose module in our program
var config = require('../../common/setup/config');
var mongoose = require('mongoose');
var async = require('../../node_modules/async');
var graceNote = require('../../common/services/grace-note');
var date = require('../../common/services/date');
var logger = require('../../common/setup/logger');
var _ = require('../../node_modules/lodash/lodash');

require('../../common/models/channel');

var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.8/yiptv');
var Channel = dbYip.model('Channel');

//var daysRetrieve = process.argv[2];
//var daysKeep = process.argv[3];

var daysRetrieve = config.graceNoteDaysRetrieve;
var daysKeep = config.graceNoteDaysKeep;

if(daysRetrieve > 14 || daysRetrieve === undefined) {
    daysRetrieve = 14;
} else if (daysRetrieve < 0) {
    daysRetrieve = 1;
}	

if(daysKeep < 0 || daysKeep === undefined) {
    daysKeep = 5;
}

var stationIds = [];

//setInterval(function() {
    var now = new Date();
    var startTime = date.isoDate(now);
    logger.logInfo('startTime'+startTime);

    var temp = new Date();
    temp.setDate(temp.getDate() - daysKeep);
    var startTimeDb = date.isoDate(temp);

    now.setDate(now.getDate() + daysRetrieve);
    var endTime = date.isoDate(now);
    logger.logInfo('endTime '+endTime);
    
    async.waterfall([
         function(callback) {
             Channel.find({}, function(err, channels) {
                 if(err) {
                     logger.logError('channel-guide - Channel.find error: '+err);
                 } else {
                     logger.logInfo('Channel.find documents found in db: '+channels.length);
                     for(var i = 0; i < channels.length; i++) {
                         stationIds.push({stationId: channels[i].stationId, dbId: channels[i]._id});
                         logger.logInfo(stationIds[i]);
                     }
                 }
                 callback(err, channels);
             });
         }, 
         
         function(channels, callback) {
             graceNote.getChannelList(function (err, data) {
                 if (err) {
                     logger.logError('channel-guide - getChannelGuide error: '+err);
                 } else {
                     logger.logInfo('getChannelList from gracenote length: '+data.length);
                 }
                 callback(err, channels, data);
             });
         },
         
         function(channels, data, callback) {
             async.eachSeries(
                 data, 
                 function (channelGn, cb) {
                     if(channels.length === 0) {
                         logger.logInfo('getChannelGuide new channel found, save to db');
                         saveChannel(channelGn, function (err, newChannel) {
                             if (err) {
                                 logger.logError('channel-guide - saveChannel - error save new channel: ' + err);
                             }
                             cb(err, newChannel);
                         });
                     } else {
                         var bNewChannel = true;
                         var i = 0;
                         for(; i < stationIds.length; i++) {
                             if(stationIds[i].stationId === channelGn.stationId) {
                                 bNewChannel = false;
                                 break;
                             }
                         }
                         
                         if(bNewChannel) {
                             logger.logInfo('getChannelGuide new channel found, save to db');
                             saveChannel(channelGn, function (err, newChannel) {
                                 if (err) {
                                     logger.logError('channel-guide - saveChannel - error save new channel: ' + err);
                                 }
                                 cb(err, newChannel);
                             });
                         } else {
                             logger.logInfo('getChannelGuide channel exists in db with index '+i+', update db');
                             updateChannel(channels[i], channelGn, startTimeDb, function (err, channel) {
                                 if(err) {
                                     logger.logError('channel-guide updateChannel - error save old channel: ' + err);
                                 }
                                 cb(err, channel);
                             });
                         } 
                     }
                 },
                 function (err) {
                     callback(err);
                     logger.logInfo('gracenote metadata retrieval succeed! ');
                 }
             );
         }], 
         
         function(err) {
         if (err) {
             logger.logError('channel-guide async.waterfall error: '+err);
         } else {
             logger.logInfo('get channel guide succeed!');
         }
         setTimeout(function () {
             process.exit(0);
         }, 3000);
    });
//}, config.graceNoteProcessInterval);

function updateChannel(channel, dataGn, startTimeDb, cb) {
    graceNote.getChannelGuide(dataGn.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('channel-guide - updateChannel error: '+err);
        } else {
        
            logger.logInfo('updateChannel program length retrieved from gracenote: '+channel.airings.length);
            
            var count = 0;
            for(var j = 0; j < channel.airings.length; j++) {
                if(channel.airings[j].startTime < startTimeDb) {
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
                if (cb) {
                    cb(err, channel);
                }
            });
        }
    });
}

function saveChannel(channel, cb) {
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
                if (cb) {
                    cb(err, newChannel);
                }
            });
        }
    });
}