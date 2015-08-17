'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob;
var config = require('../../common/setup/config');
var mongoose = require('mongoose');
var async = require('../../node_modules/async');
var graceNote = require('../../common/services/grace-note');
var date = require('../../common/services/date');
var logger = require('../../common/setup/logger');

require('../../common/models/channel');

var dbYip = mongoose.createConnection(config.db);
var Channel = dbYip.model('Channel');

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

new CronJob(config.metaDataRetrievalRecurrence, function () {
        getChannelGuide();
    }, 
    function () {
        logger.logInfo('gracenote-processor-main - CronJob - gracenote retrieval has finished');
    },
    true,
    'America/New_York'
);

function getChannelGuide() {
    var stationIds = [];
    var now = new Date();
    var startTime = date.isoDate(now);
    logger.logInfo('startTime' + startTime);

    var temp = new Date();
    temp.setDate(temp.getDate() - daysKeep);
    var startTimeDb = date.isoDate(temp);

    now.setDate(now.getDate() + daysRetrieve);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    var endTime = date.isoDate(now);
    logger.logInfo('endTime ' + endTime);
    
    async.waterfall([
         function(callback) {
             Channel.find({}, function(err, channels) {
                 if(err) {
                     logger.logError('gracenote-processor-main - getChannelGuide db error: ' + err);
                 } else {
                     logger.logInfo('gracenote-processor-main - getChannelGuide documents found in db: ' + channels.length);
                     for(var i = 0; i < channels.length; i++) {
                         stationIds.push({stationId: channels[i].stationId, dbId: channels[i]._id});
                     }
                 }
                 callback(err, channels);
             });
         }, 
         
         function(channels, callback) {
             graceNote.getChannelList(function (err, data) {
                 if (err) {
                     logger.logError('gracenote-processor-main - getChannelGuide - gracenote error: ' + err);
                 } else {
                     logger.logInfo('gracenote-processor-main - getChannelGuide - gracenote channel list length: ' + data.length);
                 }
                 callback(err, channels, data);
             });
         },
         
         function(channels, data, callback) {
             async.eachSeries(
                 data, 
                 function (channelGraceNote, cb) {
                     if(channels.length === 0) {
                         logger.logInfo('gracenote-processor-main - getChannelGuide - new channel found in gracenote, save to db');
                         saveChannel(channelGraceNote, startTime, endTime, function (err, newChannel) {
                             if (err) {
                                 logger.logError('gracenote-processor-main - saveChannel - error save new channel: ' + err);
                             }
                             cb(err, newChannel);
                         });
                     } else {
                         var isNewChannel = true;
                         var i = 0;
                         for(; i < stationIds.length; i++) {
                             if(stationIds[i].stationId === channelGraceNote.stationId) {
                                 isNewChannel = false;
                                 break;
                             }
                         }
                         
                         if(isNewChannel) {
                             logger.logInfo('gracenote-processor-main - getChannelGuide - new channel found in gracenote, save to db');
                             saveChannel(channelGraceNote, startTime, endTime, function (err, newChannel) {
                                 if (err) {
                                     logger.logError('gracenote-processor-main - saveChannel - error save new channel: ' + err);
                                 }
                                 cb(err, newChannel);
                             });
                         } else {
                             logger.logInfo('gracenote-processor-main - getChannelGuide - channel exists in db with index ' + i + ', update db');
                             updateChannel(channels[i], channelGraceNote, startTime, endTime, startTimeDb, function (err, channel) {
                                 if(err) {
                                     logger.logError('gracenote-processor-main updateChannel - error save existing channel: ' + err);
                                 }
                                 cb(err, channel);
                             });
                         } 
                     }
                 },
                 function (err) {
                     logger.logInfo('gracenote-processor-main - gracenote retrieval succeed! ');
                     callback(err);
                 }
             );
         }], 
         
         function(err) {
         if (err) {
             logger.logError('gracenote-processor-main - getChannelGuide - error: ' + err);
         } else {
             logger.logInfo('gracenote-processor-main - get channel guide succeed!');
         }
    });
}

function updateChannel(channel, dataGraceNote, startTime, endTime, startTimeDb, cb) {
    graceNote.getChannelGuide(dataGraceNote.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('gracenote-processor-main - updateChannel - error: ' + err);
        } else {
        
            logger.logInfo('gracenote-processor-main - updateChannel - programs retrieved from gracenote in total: ' + data[0].airings.length);
            
            var count = 0;
            for(var j = 0; j < channel.airings.length; j++) {
                if(channel.airings[j].startTime < startTimeDb) {
                    count++;
                } else {
                    break;
                }
            }
            logger.logInfo('gracenote-processor-main - updateChannel - old programs dropped off from the channel: ' + count);
    
            channel.airings.splice(0, count);
            
            var index = 0;
            var isAiringFound = false;
            for(var i = 0; i < channel.airings.length; i++) {
                if(data[0].airings[0].startTime === channel.airings[i].startTime) {
                    index = i;
                    isAiringFound = true;
                    break;
                }
            }
            
            if(isAiringFound) {
                channel.airings.splice(index, channel.airings.length - index);
            } else {
                index = 0;
                for(i = 0; i < channel.airings.length; i++) {
                    if(data[0].airings[0].startTime > channel.airings[i].endTime) {
                        index++; 
                    } else {
                        break;
                    }
                }
                
                channel.airings.splice(index, channel.airings.length - index);
            }
            
            logger.logInfo('gracenote-processor-main - updateChannel - programs left before adding programs from gracenote: ' + channel.airings.length);
            
            for(i = 0; i < data[0].airings.length; i++) {
                channel.airings.push(data[0].airings[i]);
                channel.airings[channel.airings.length-1].startTime = date.isoDate(new Date(data[0].airings[i].startTime));
                channel.airings[channel.airings.length-1].endTime = date.isoDate(new Date(data[0].airings[i].endTime));
            }
    
            logger.logInfo('gracenote-processor-main - updateChannel - programs in total: ' + channel.airings.length);
    
            channel.save(function (err) {
                if (cb) {
                    cb(err, channel);
                }
            });
        }
    });
}

function saveChannel(channel, startTime, endTime, cb) {
    graceNote.getChannelGuide(channel.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('gracenote-processor-main - saveChannel - error: ' + err);
        } else {
            
            var newChannel = new Channel(data[0]);
            logger.logInfo('gracenote-processor-main - saveChannel - programs in total: ' + data[0].airings.length);
            
            for(var i = 0; i < newChannel.airings.length; i++) {
                newChannel.airings[i].startTime = date.isoDate(new Date(newChannel.airings[i].startTime));
                newChannel.airings[i].endTime = date.isoDate(new Date(newChannel.airings[i].endTime));
            }
            
            newChannel.save(function (err) {
                if (cb) {
                    cb(err, newChannel);
                }
            });
        }
    });
}