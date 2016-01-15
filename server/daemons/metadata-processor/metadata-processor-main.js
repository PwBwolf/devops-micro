'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob;
var config = require('../../common/setup/config');
var mongoose = require('mongoose');
var async = require('../../node_modules/async');
var graceNote = require('../../common/services/grace-note');
var date = require('../../common/services/date');
var logger = require('../../common/setup/logger');
var fs = require('../../node_modules/fs-extended');
var request = require('../../node_modules/request');
var _ = require('../../node_modules/lodash');
var email = require('../../common/services/email');

require('../../common/models/channel');
require('../../common/models/image');
require('../../common/models/image-data');

var dbYip = mongoose.createConnection(config.db);
var Channel = dbYip.model('Channel');
var Image = dbYip.model('Image');
var ImageData = dbYip.model('ImageData');

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
        imageDownload();
    }, 
    function () {
        logger.logInfo('metadata-processor-main - CronJob - gracenote retrieval has finished');
    },
    true,
    'America/New_York'
);

function getChannelGuide() {
    var stationIds = [];
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    var temp = new Date(now);
    temp.setDate(temp.getDate() - daysKeep);
    var startTime = date.isoDate(temp);
    logger.logInfo('startTime' + startTime);
    
    now.setDate(now.getDate() + daysRetrieve);
    var endTime = date.isoDate(now);
    logger.logInfo('endTime ' + endTime);
    
    async.waterfall([
         function(callback) {
             Channel.find({}, function(err, channels) {
                 if(err) {
                     logger.logError('metadataProcessorMain - getChannelGuide - failed to find in Channel db');
                     logger.logError(err);
                     callback(err);
                 } else {
                     logger.logInfo('metadataProcessorMain - getChannelGuide documents found in db: ' + channels.length);
                     var stationIdsUniq = [];
                     for(var i = 0; i < channels.length; i++) {
                         stationIds.push({stationId: channels[i].stationId, dbId: channels[i]._id, count: 0});
                     }
                     if(stationIds.length > 0) {
                         stationIdsUniq = _.uniq(stationIds, 'stationId');
                     }
                     
                     if(stationIdsUniq.length !== stationIds.length) {
                         var itemsTobeRemoved = [];
                         var itemsIndex = [];
                         for(var i = 0; i < stationIds.length; ++i) {
                             for(var j = 0; j < stationIdsUniq.length; ++j) {
                                 if(stationIds[i].stationId === stationIdsUniq[j].stationId) {
                                     if(stationIdsUniq[j].count > 0) {
                                         itemsTobeRemoved.push(stationIds[i].dbId);
                                         itemsIndex.push(i);
                                     } else {
                                         stationIdsUniq[j].count = 1;
                                     }
                                     break;
                                 }
                             }
                         }
                         
                         for(var i = 0; i < itemsIndex.length; ++i) {
                             channels.splice(itemsIndex[i], 1);
                         }
                         
                         async.eachSeries(
                             itemsTobeRemoved,
                             
                             function (item, cb) {
                                 Channel.remove({_id: item}, function (err, entries) {
                                    if(err) {
                                        logger.logError('metadataProcessorMain - getChannelGuide - failed to remove Channel doc in db');
                                        logger.logError(err);
                                        cb(err);
                                    } else {
                                        logger.logInfo('metadataProcessorMain - getChannelGuide - remove duplicated Channel doc in db succeed: ' + entries);
                                        cb(null, entries);
                                    }
                                 });
                             }, 
                             
                             function (err) {
                                 if(err) {
                                     logger.logError('metadataProcessorMain - getChannelGuide - failed to remove Channel doc in db in async');
                                     logger.logErr(err);
                                     callback(err);
                                 } else {
                                     logger.logInfo('metadataProcessorMain - getChannelGuide - remove Channel doc succeed in async');
                                     callback(null, channels);
                                 }
                             }
                         );
                     } else {
                         callback(null, channels);
                     }
                 }
             });
         }, 
         
         function(channels, callback) {
             graceNote.getChannelList(function (err, data) {
                 if (err) {
                     logger.logError('metadataProcessorMain - getChannelGuide - failed to gracenote getChannelList');
                     logger.logError(err);
                 } else {
                     logger.logInfo('metadataProcessorMain - getChannelGuide - gracenote channel list length: ' + data.length);
                 }
                 
                 if(channels.length ===0) {
                     callback(err, channels, data);
                 } else {
                     async.eachSeries(
                         channels,
                         function (channelDb, cb) {
                             var isChannelRemoved = true;
                             var i = 0;
                             for(; i < data.length; i++) {
                                 if(channelDb.stationId === data[i].stationId) {
                                     isChannelRemoved = false;
                                     break;
                                 }
                             }
                             
                             if(isChannelRemoved) {
                                 channelDb.status = 'removed';
                                 channelDb.save(function(err) {
                                     cb(err, channelDb);
                                 });
                             } else {
                                 cb(null, channelDb);
                             }
                         },
                         function (err) {
                             if(err) {
                                 logger.logError('metadataProcessorMain - getChannelGuide - failed to update channelDb');
                                 logger.logError(err);
                             } else {
                                 logger.logInfo('metadataProcessorMain - update channelDb status succeed! ');
                             }
                             callback(err, channels, data);
                         }
                     );
                 }
             });
         },
         
         function(channels, data, callback) {
             async.eachSeries(
                 data, 
                 function (channelGraceNote, cb) {
                     if(channels.length === 0) {
                         logger.logInfo('metadataProcessorMain - getChannelGuide - new channel found in gracenote, save to db');
                         saveChannel(channelGraceNote, startTime, endTime, function (err, newChannel) {
                             if (err) {
                                 logger.logError('metadataProcessorMain - saveChannel - failed to save new channel');
                                 logger.logError(err);
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
                             logger.logInfo('metadataProcessorMain - getChannelGuide - new channel found in gracenote, save to db');
                             saveChannel(channelGraceNote, startTime, endTime, function (err, newChannel) {
                                 if (err) {
                                     logger.logError('metadataProcessorMain - saveChannel - failed to save new channel');
                                     logger.logError(err);
                                 }
                                 cb(err, newChannel);
                             });
                         } else {
                             logger.logInfo('metadataProcessorMain - getChannelGuide - channel exists in db with index ' + i + ', update db');
                             updateChannel(channels[i], channelGraceNote, startTime, endTime, function (err, channel) {
                                 if(err) {
                                     logger.logError('metadataProcessorMain - updateChannel - failed to update existing channel');
                                     logger.logError(err);
                                 }
                                 cb(err, channel);
                             });
                         } 
                     }
                 },
                 function (err) {
                     if(err) {
                         logger.logError('metadataProcessorMain - updateChannel - failed to save/update channels');
                         logger.logError(err);
                     } else {
                         logger.logInfo('metadataProcessorMain - gracenote retrieval succeed! ');
                     }
                     callback(err);
                 }
             );
         }], 
         
         function(err) {
         if (err) {
             logger.logError('metadataProcessorMain - getChannelGuide failed');
             logger.logError(err);
             sendMail('channel guide failed', err, null);
         } else {
             logger.logInfo('metadataProcessorMain - get channel guide succeed!');
             sendMail('channel guide succeed', 'done', null);
         }
    });
};

function updateChannel(channel, dataGraceNote, startTime, endTime, cb) {
    graceNote.getChannelGuide(dataGraceNote.stationId, startTime, endTime, function (err, data) {
        if (err) {
            logger.logError('metadataProcessorMain - updateChannel - failed to getChannelGuide in gracenote');
            logger.logError(err);
            cb(err);
        } else {
            if(data[0].airings) {
                logger.logInfo('metadataProcessorMain - updateChannel - programs retrieved from gracenote in total: ' + data[0].airings.length);
        
                channel.airings.splice(0, channel.airings.length);
                channel.status = 'active';
                for(var i = 0; i < data[0].airings.length; i++) {
                    channel.airings.push(data[0].airings[i]);
                    channel.airings[channel.airings.length-1].startTime = date.isoDate(new Date(data[0].airings[i].startTime));
                    channel.airings[channel.airings.length-1].endTime = date.isoDate(new Date(data[0].airings[i].endTime));
                }
        
                logger.logInfo('metadataProcessorMain - updateChannel - programs in total: ' + channel.airings.length);
        
                channel.save(function (err) {
                    if (cb) {
                        cb(err, channel);
                    }
                });
            } else {
                logger.logInfo('metadataProcessorMain - updateChannel - no airings: ' + dataGraceNote.stationId);
                cb(null);
            }
        }
    });
};

function saveChannel(channel, startTime, endTime, cb) {
    if(channel.stationId === undefined) {
        logger.logInfo('metadataProcessorMain - saveChannel - no stationId: ' + channel.callSign);
        cb(null, null);
    } else {
        graceNote.getChannelGuide(channel.stationId, startTime, endTime, function (err, data) {
            if (err) {
                logger.logError('metadataProcessorMain - saveChannel - failed to getChannelGuide in gracenote: ' + channel.stationId);
                logger.logError(err);
                cb(err);
            } else {
                if(data[0].airings) {
                    var newChannel = new Channel(data[0]);
                    logger.logInfo('metadataProcessorMain - saveChannel - programs in total: ' + data[0].airings.length);
                    
                    for(var i = 0; i < newChannel.airings.length; i++) {
                        newChannel.airings[i].startTime = date.isoDate(new Date(newChannel.airings[i].startTime));
                        newChannel.airings[i].endTime = date.isoDate(new Date(newChannel.airings[i].endTime));
                    }
                    
                    newChannel.status = 'active';
                    
                    newChannel.save(function (err) {
                        if (cb) {
                            cb(err, newChannel);
                        }
                    });
                } else {
                    logger.logInfo('metadataProcessorMain - saveChannel - no airings: ' + channel.stationId);
                    cb(null);
                }
            }
        });
    }
};

function imageDownload() {
    var imageUriUniq = [];
    var imageUriUniqRemoved = [];
    var imageUriTemp = [];
    var imageCount = 0;
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    var temp = new Date(now);
    temp.setDate(temp.getDate() - daysKeep);
    var startTime = date.isoDate(temp);
    logger.logInfo('startTime' + startTime);
    
    now.setDate(now.getDate() + daysRetrieve);
    var endTime = date.isoDate(now);
    logger.logInfo('endTime ' + endTime);
    var isSaveImageToDb = true;
    
    async.waterfall([
        function(callback) {
            Image.find({type: 'channel'}, function(err, images) {
                if(err) {
                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve channel images from db in initial');
                    logger.logError(err);
                    callback(err);
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - images type channel found in db in initial: ' + images.length);
                    
                    async.eachSeries(
                        images,
                        function(image, cb) {
                            if(image.dataId) {
                                cb(null);
                            } else {
                                Image.remove({_id: image._id}, function(err, entries) {
                                    if(err) {
                                        logger.logError('metadataProcessorMain - imageDownload - failed to remove channel image from Image collection in initial');
                                        logger.logError(err);
                                        cb(err);
                                    } else {
                                        logger.logInfo('metadataProcessorMain - imageDownload - remove channel image from Image collection succeed in initial with: ' + entries);
                                        cb(null);
                                    }
                                });
                            }
                        },
                        function (err) {
                            if(err) {
                                logger.logError('metadataProcessorMain - imageDownload - channel initial from db failed');
                                logger.logError(err);
                                callback(err);
                                return;
                            } else {
                                logger.logInfo('metadataProcessorMain - imageDownload - channel initial from db succeed! ');
                            }
                            callback(null);
                        }
                    );
                }
            });
        }, 
        
        function(callback) {
            Image.find({type: 'channel'}, function(err, images) {
                if(err) {
                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve channel images from db');
                    logger.logError(err);
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - images type channel found in db: ' + images.length);
                    
                    for(var i = 0; i < images.length; i++) {
                        imageUriUniq.push({uri: images[i].preferredImage.uri, type: images[i].type, status: 'saved', id: images[i].identifier});
                    }
                    imageUriUniq = _.uniq(imageUriUniq, 'uri');
                    imageCount = imageUriUniq.length;
                    logger.logInfo('metadataProcessorMain - imageDownload - unique images type channel found in db: ' + imageUriUniq.length);
                }
                callback(err, images);
            });
        }, 
        
        function(images, callback) {
            graceNote.getChannelList(function (err, data) {
                if (err) {
                    logger.logError('metadataProcessorMain - imageDownload - gracenote error');
                    logger.logError(err);
                    callback(err);
                    return;
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - gracenote channel list length: ' + data.length);
                }
                
                var imageUri = [];
                for(var i = 0; i < data.length; i++) {
                    var isChannelNew = true;
                    for(var j = 0; j < images.length; j++) {
                        if(images[j].identifier === data[i].stationId) {
                            isChannelNew = false;
                            break;
                        }
                    }
                    if(isChannelNew) {
                        imageUri.push({uri: data[i].preferredImage.uri, type: 'channel', status: 'new', id: data[i].stationId});
                    }
                }
                
                logger.logInfo('metadataProcessorMain - imageDownload - initial images length: ' + imageUri.length);
                
                var imageUriUniqTemp = _.uniq(imageUri, 'uri');
                var imageUriUniqCount = imageUriUniq.length;
                for(var i = 0; i < imageUriUniqTemp.length; i++) {
                    var isImageInTempUniq = true;
                    for(var j = 0; j < imageUriUniqCount; j++) {
                        if(imageUriUniqTemp[i].uri === imageUriUniq[j].uri) {
                            isImageInTempUniq = false;
                            break;
                        }
                    }
                    if(isImageInTempUniq) {
                        imageUriUniq.push(imageUriUniqTemp[i]);
                    }
                }
                logger.logInfo('metadataProcessorMain - imageDownload - unique images type channel found in gracenote: ' + (imageUriUniq.length - imageCount));

                async.eachSeries(
                    data,
                    function(dataItem, cb) {
                        var imageUriExist = false;
                        for(var i = 0; i < imageUri.length; i++) {
                            if(dataItem.stationId === imageUri[i].id) {
                                imageUriExist = true;
                                saveImage(dataItem, 'channel', dataItem.stationId, cb);
                                break;
                            }
                            
                        }
                        if(!imageUriExist) {
                            cb(null);
                        }
                    },
                    function (err) {
                        if(err) {
                            logger.logError('metadataProcessorMain - saveImage - type channel failed');
                            logger.logError(err);
                            callback(err);
                            return;
                        } else {
                            logger.logInfo('metadataProcessorMain - saveImage - type channel succeed! ');
                        }
                        callback(null, images, data);
                    }
                );
            });
        },
        
        function(images, data, callback) {
            
            imageUriUniq.splice(0, imageCount);
            logger.logInfo('metadataProcessorMain - imageDownload - channel images to download: ' + imageUriUniq.length);
            
            if(imageUriUniq.length > 0) {
                async.eachSeries(
                    imageUriUniq,
                    function (item, cb) {
                        if(isSaveImageToDb) {
                            ImageData.find({uri: item.uri}, function(err, imageData) {
                                if (err) {
                                    logger.logError('metadataProcessorMain - imageDownload - failed to find item in ImageData with uri: ' + item.uri);
                                    logger.logError(err);
                                    cb(err);
                                    return;
                                } else {
                                    logger.logInfo('metadataProcessorMain - imageDownload - find item in ImageData: ' + imageData.length);
                                    if(imageData.length === 0) {
                                        var fileNameIndex = item.uri.lastIndexOf("/") + 1;
                                        var filename = item.uri.slice(fileNameIndex);
                                        saveImageToDb(config.graceNoteImageUrl, item.uri, filename, cb);
                                    } else {
                                        logger.logInfo('metadataProcessorMain - imageDownload - image data has already existed in db');
                                        cb(null);
                                    }  
                                }
                            });   
                        } else {
                            var filename = item.uri;
                            filename = 'images/channels/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                            download(config.graceNoteImageUrl+item.uri, filename, cb);
                        }
                    },
                    function (err) {
                        if(err) {
                            logger.logError('metadataProcessorMain - download image status failed');
                            logger.logError(err);
                        } else {
                            logger.logInfo('metadataProcessorMain - download image status succeed! ');
                        }
                        callback(err, data);
                    }
                );
            } else {
                logger.logInfo('metadataProcessorMain - download - no new images found')
                callback(null, data);
            }
        },

        function(data, callback) {
            Image.find({type: 'program'}, function(err, images) {
                if(err) {
                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve program images from db in initial');
                    logger.logError(err);
                    callback(err);
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - images type program found in db in initial: ' + images.length);
                    
                    async.eachSeries(
                        images,
                        function(image, cb) {
                            if(image.dataId) {
                                cb(null);
                            } else {
                                Image.remove({_id: image._id}, function(err, entries) {
                                    if(err) {
                                        logger.logError('metadataProcessorMain - imageDownload - failed to remove program image from Image collection in initial');
                                        logger.logError(err);
                                        cb(err);
                                    } else {
                                        logger.logInfo('metadataProcessorMain - imageDownload - remove program image from Image collection succeed in initial with: ' + entries);
                                        cb(null);
                                    }
                                });
                            }
                        },
                        function (err) {
                            if(err) {
                                logger.logError('metadataProcessorMain - imageDownload - program  initial from db failed');
                                logger.logError(err);
                                callback(err);
                                return;
                            } else {
                                logger.logInfo('metadataProcessorMain - imageDownload - program initial from db succeed! ');
                            }
                            callback(null, data);
                        }
                    );
                }
            });
        },
        
        function(data, callback) {
            imageUriUniq.splice(0, imageUriUniq.length);
            imageCount = 0;
            logger.logInfo('metadataProcessorMain - imageDownload - start program image download process');
            Image.find({type: 'program'}, function(err, images) {
                if(err) {
                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve program images from db');
                    logger.logError(err);
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - images type program found in db: ' + images.length);
                    imageCount = images.length;
                    for(var i = 0; i < images.length; i++) {
                        imageUriUniq.push({uri: images[i].preferredImage.uri, type: images[i].type, status: 'saved', id: images[i].identifier});
                    }
                }
                callback(err, images, data);
            });
        }, 
        
        function(images, data, callback) {
            async.eachSeries(
                data, 
                function (channelGraceNote, cb) {
                    if(channelGraceNote.stationId === undefined) {
                        logger.logInfo('metadataProcessorMain - imageDownload - no stationId: ' + channelGraceNote.callSign);
                        cb(null);
                    } else {
                        graceNote.getChannelGuide(channelGraceNote.stationId, startTime, endTime, function (err, dataPrograms) {
                            if (err) {
                                logger.logError('metadataProcessorMain - imageDownload - failed to getChannelGuide from gracenote: ' + channelGraceNote.stationId );
                                logger.logError(err);
                                cb(err);
                                return;
                            } else {
                                var airings = dataPrograms[0].airings;
                                logger.logInfo('metadataProcessorMain - imageDownload - programs retrieved from gracenote in total: ' + airings.length);
                                
                                var imageUri = [];
                                for(var i = 0; i < airings.length; i++) {
                                    imageUri.push({uri: airings[i].program.preferredImage.uri, type: 'program', status: 'new', id: airings[i].program.tmsId});
                                }
                                
                                logger.logInfo('metadataProcessorMain - imageDownload - initial program images length: ' + imageUri.length);
                                
                                var imageUriUniqTemp = _.uniq(imageUri, 'uri');
                                imageUriTemp = imageUriTemp.concat(imageUriUniqTemp);
                                imageUriTemp = _.uniq(imageUriTemp, 'uri');
                                logger.logInfo('metadataProcessorMain - imageDownload - accumulated unique program images in gracenote length: ' + imageUriTemp.length);
                                var imageUriUniqCount = imageUriUniq.length;
                                for(var i = 0; i < imageUriUniqTemp.length; i++) {
                                    var isImageInTempUniq = true;
                                    for(var j = 0; j < imageUriUniqCount; j++) {
                                        if(imageUriUniqTemp[i].uri === imageUriUniq[j].uri) {
                                            isImageInTempUniq = false;
                                            break;
                                        }
                                    }
                                    if(isImageInTempUniq) {
                                        imageUriUniq.push(imageUriUniqTemp[i]);
                                    }
                                }
                                
                                var imageNewCount = imageUriUniq.length - imageUriUniqCount;
                                logger.logInfo('metadataProcessorMain - imageDownload - unique program images added: ' + imageNewCount);
                                
                                async.eachSeries(
                                    airings,
                                    function (airing, cb1) {
                                        var imageUriCopy = true;
                                        for(var i = imageUriUniq.length-1, m = 0 ; m < imageNewCount; i--, m++) {
                                            if(imageUriUniq[i].uri === airing.program.preferredImage.uri && imageUriUniq[i].status === 'new') {
                                                imageUriUniq[i].status = 'saved';
                                                imageUriCopy = false;
                                                saveImage(airing.program, 'program', airing.program.tmsId, cb1);
                                                break;
                                            }
                                        }
                                        if(imageUriCopy) {
                                            cb1(null);
                                        }
                                    },
                                    function (err) {
                                        if(err) {
                                            logger.logError('metadataProcessorMain - saveImage - type program failed');
                                            logger.logError(err);
                                            cb(err);
                                            return;
                                        } else {
                                            logger.logInfo('metadataProcessorMain - saveImage - type program succeed! ');
                                        }
                                        cb(err, images, data);
                                    }
                                );
                            }
                        });
                    }
                },
                function (err) {
                    if(err) {
                        logger.logError('metadataProcessorMain - saveImage - error save/update images');
                        logger.logError(err);
                    } else {
                        logger.logInfo('metadataProcessorMain - gracenote retrieval succeed! ');
                    }
                    callback(err, images, data);
                }
            );
        },
        
        function(images, data, callback) {
            
            imageUriUniqRemoved = imageUriUniq.splice(0, imageCount);
            logger.logInfo('metadataProcessorMain - imageDownload - program images to download: ' + imageUriUniq.length);
            
            if(imageUriUniq.length > 0) {
                async.eachSeries(
                    imageUriUniq,
                    function (item, cb) {
                        if(isSaveImageToDb) {
                            ImageData.find({uri: item.uri}, function(err, imageData) {
                                if (err) {
                                    logger.logError('metadataProcessorMain - imageDownload - failed to find program item in ImageData with uri: ' + item.uri);
                                    logger.logError(err);
                                    cb(err);
                                    return;
                                } else {
                                    logger.logInfo('metadataProcessorMain - imageDownload - find program item in ImageData: ' + imageData.length);
                                    if(imageData.length === 0) {
                                        var fileNameIndex = item.uri.lastIndexOf("/") + 1;
                                        var filename = item.uri.slice(fileNameIndex);
                                        saveImageToDb(config.graceNoteImageUrl, item.uri, filename, cb);
                                    } else {
                                        logger.logInfo('metadataProcessorMain - imageDownload - program image data has already existed in db');
                                        cb(null);
                                    }  
                                }
                            });
                        } else {
                            var filename = item.uri;
                            filename = 'images/programs/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                            download(config.graceNoteImageUrl+item.uri, filename, cb);
                        }
                    },
                    function (err) {
                        if(err) {
                            logger.logError('metadataProcessorMain - download image status failed');
                            logger.logError(err);
                        } else {
                            logger.logInfo('metadataProcessorMain - download image status succeed! ');
                        }
                        callback(err, images, data);
                    }
                );
            } else {
                logger.logInfo('metadataProcessorMain - download - no new images found')
                callback(null, images, data);
            }
        },
        
        function(images, data, callback) {
            Image.find(function(err, images) {
                if(err) {
                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve images from db');
                    logger.logError(err);
                    callback(err);
                    return;
                } else {
                    logger.logInfo('metadataProcessorMain - imageDownload - images found in db: ' + images.length);
                    async.eachSeries(
                        images,
                        function(image, cb) {
                            ImageData.find({uri: image.preferredImage.uri}, function(err, data) {
                                if(err) {
                                    logger.logError('metadataProcessorMain - imageDownload - failed to retrieve imageData from db');
                                    logger.logError(err);
                                    cb(err);
                                } else {
                                    if(data.length === 0) {
                                        logger.logError('metadataProcessorMain - imageDownload - retrieve imageData from db return 0 with uri: ' + image.preferredImage.uri);
                                        cb(err);
                                    } else {
                                        image.dataId = data[0]._id;
                                        image.save(function(err) {
                                            if(cb) {
                                                cb(err, image);
                                            }
                                        });
                                    }
                                }
                            });
                        },
                        function (err) {
                            if(err) {
                                logger.logError('metadataProcessorMain - failed to add imagedata into image as reference');
                                logger.logError(err);
                            } else {
                                logger.logInfo('metadataProcessorMain - add imagedata into image as reference succeed! ');
                            }
                            callback(err, images);
                        }
                    );
                }
            });
        },
        
        function(imagesUri, callback) {
            
            logger.logInfo('metadataProcessorMain - imageDownload - total program images from gracenote: ' + imageUriTemp.length);
            imageUriUniq = imageUriUniq.concat(imageUriUniqRemoved);
            logger.logInfo('metadataProcessorMain - imageDownload - total old program images in db: ' + imageUriUniq.length);
            var imagesTobeRemoved = [];
            var countRemoved = 0;
            for(var i = 0; i < imageUriUniq.length; i++) {
                var isImageExistInTemp = false;
                for(var j = 0; j < imageUriTemp.length; j++) {
                    if(imageUriUniq[i].uri === imageUriTemp[j].uri) {
                        isImageExistInTemp = true;
                        break;
                    }
                }
                if(!isImageExistInTemp) {
                    imagesTobeRemoved.push(imageUriUniq[i]);
                    countRemoved++;
                }
            }
            logger.logInfo('metadataProcessorMain - imageDownload - total old program images to be removed: ' + countRemoved);
            callback(null, imagesTobeRemoved, countRemoved);
        },
        
        function(imagesRemoved, count, callback) {
            if(count === 0) {
                logger.logInfo('metadataProcessorMain - imageDownload - no program images need to be removed from db');
                callback(null);
                return;
            } 
            logger.logInfo('metadataProcessorMain - imageDownload - total image to be removed from Image and ImageData: ' + imagesRemoved.length);
            async.eachSeries(
                imagesRemoved,
                function(imageRemoved, cb) {
                    Image.find({type: 'program', 'preferredImage.uri': imageRemoved.uri}, function(err, removed) {
                        if(err) {
                            logger.logError('metadataProcessorMain - imageDownload - failed to find to be removed image in Images');
                            logger.logError(err);
                            cb(err);
                            return;
                        } else {
                            logger.logInfo('metadataProcessorMain - imageDownload - image to be removed found in Image: ' + removed.length);
                            if(removed.length === 0) {
                                logger.logInfo('metadataProcessorMain - imageDownload - could not find the to be removed image: ' + imageRemoved.uri);
                                cb(err, removed);
                            } else {
                                ImageData.remove({_id: removed[0].dataId}, function(err, entries) {
                                   if(err) {
                                       logger.logError('metadataProcessorMain - imageDownload - failed to remove imagedata from ImageData collections');
                                       logger.logError(err);
                                       cb(err);
                                   } else {
                                       logger.logInfo('metadataProcessorMain - imageDownload - remove imagedata from ImageData collection succeed with: ' + entries);
                                       Image.remove({type: 'program', 'preferredImage.uri': imageRemoved.uri}, function(err, entries) {
                                          if(err) {
                                              logger.logError('metadataProcessorMain - imageDownload - failed to remove image from Image collection');
                                              logger.logError(err);
                                              cb(err);
                                          } else {
                                              logger.logInfo('metadataProcessorMain - imageDownload - remove image from Image collection succeed with: ' + entries);
                                              cb(null);
                                          }
                                       });
                                   }
                                });
                            }
                        }
                    });
                },
                function (err) {
                    if(err) {
                        logger.logError('metadataProcessorMain - failed to remove program images in db');
                        logger.logError(err);
                    } else {
                        logger.logInfo('metadataProcessorMain - program image removal succeed! ');
                    }
                    callback(err, imagesRemoved);
                }
            );  
        }
        ], 
        
        function(err) {
        if (err) {
            logger.logError('metadataProcessorMain - image processor - failed');
            logger.logError(err);
            sendMail('image processor failed', err, null);
        } else {
            logger.logInfo('metadataProcessorMain - image processor succeed!');
            sendMail('image processor succeed', 'done', null);
        }
        
    });
};

function saveImage(channel, type, identifier, cb) {

    var newImage = new Image(channel);
    
    newImage.type = type;
    newImage.identifier = identifier;
    newImage.source = 'gracenote';
    newImage.active = 'true';
    newImage.save(function (err) {
        if (cb) {
            cb(err, newImage);
        }
    });
};

function saveImageToDb(configUrl, uri, filename, cb) {
    request.head(configUrl + uri, function(err, res, body) {
        if (err) {
            logger.logError('metadataProcessorMain - download - failed to require head info');
            logger.logError(err);
            cb(err, filename);
        } else {
            logger.logInfo('metadataProcessorMain - download - content-type:' + res.headers['content-type']);
            logger.logInfo('metadataProcessorMain - download - content-length:' + res.headers['content-length']);
            
            var requestTemp = request.defaults({encoding: null});
            var img = new ImageData({
               name: filename,
               uri: uri,
               contentType: res.headers['content-type']
            });
            
            requestTemp.get(configUrl + uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var contentType = response.headers["content-type"];
                    if(response.headers["content-type"] === undefined) {
                        var ext =  filename.split('.').pop().toLowerCase();
                        switch(ext) {
                        case 'png': 
                            contentType = 'image/png;charset=utf-8';
                            break;
                        case 'jpg': 
                        case 'jpeg':
                            contentType = 'image/jpeg;charset=utf-8';
                            break;
                        case 'bmp':
                            contentType = 'image/bmp;charset=utf-8';
                            break;
                        case 'gif':
                            contentType = 'image/gif;charset=utf-8';
                            break;
                        case 'tif':
                        case 'tiff':
                            contentType = 'image/tiff;charset=utf-8';
                            break;
                        default:
                            contentType = 'image/' + ext + ';charset=utf-8';
                        }
                    } 
                    img.contentType = contentType;
                    logger.logInfo('metadataProcessorMain - download - content-type final:' + contentType);
                    img.data = "data:" + contentType + ";base64," + new Buffer(body).toString('base64');
                    
                    img.save(function(err) {
                        if(cb) {
                            cb(err, img);
                        }
                    });
                } else {
                    if(error) {
                        logger.logError('metadataProcessorMain - saveImageToDb - failed');
                        logger.logError(error);
                        if(cb) {
                            cb(err);
                        }
                    }
                }
            });
        }
     });
};
  
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
       if (err) {
           logger.logError('metadataProcessorMain - download - failed to require head info');
           logger.logError(err);
           callback(err, filename);
       } else {
           logger.logInfo('metadataProcessorMain - download - content-type:' + res.headers['content-type']);
           logger.logInfo('metadataProcessorMain - download - content-length:' + res.headers['content-length']);
           var stream = request(uri);
           stream.pipe(
               fs.createWriteStream(filename).on('error', function(err) {
                   logger.logError('metadataProcessorMain - download - failed to createWriteStream');
                   logger.logError(err);
                   stream.read();
               })
           )
           .on('close', function() {
               callback(null, filename);
           });
       }
    });
};

function sendMail(subject, message, cb) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: 'yliu@yiptv.com',
        subject: subject,
        text: message
    };
    email.sendEmail(mailOptions, function (err) {
        if (cb) {
            cb(err);
        }
    });
};