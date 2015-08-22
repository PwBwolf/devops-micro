'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('../../../server/node_modules/cron').CronJob;
var config = require('../../../server/common/setup/config');
var mongoose = require('../../../server/node_modules/mongoose');
var async = require('../../../server/node_modules/async');
var graceNote = require('../../../server/common/services/grace-note');
var date = require('../../../server/common/services/date');
var logger = require('../../../server/common/setup/logger');
var fs = require('../../../server/node_modules/fs-extended');
var request = require('./node_modules/request');
var _ = require('../../../server/node_modules/lodash');

require('./models/image');
require('./models/image-data');

//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.8/yiptv'); // integration
//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.11/yiptv'); // test
var dbYip = mongoose.createConnection(config.db);
var Image = dbYip.model('Image');
var ImageData = dbYip.model('ImageData');

var daysRetrieve = 1;
var daysKeep = 0;

if(daysRetrieve > 14 || daysRetrieve === undefined) {
    daysRetrieve = 14;
} else if (daysRetrieve < 0) {
    daysRetrieve = 1;
}

if(daysKeep < 0 || daysKeep === undefined) {
    daysKeep = 5;
}

/*
//new CronJob(config.metaDataRetrievalRecurrence, function () {
new CronJob('0 14 20 * * *', function () {
        //removeCollections();
        imageDownload();
    }, 
    function () {
        logger.logInfo('imageProcessorMain - CronJob - gracenote retrieval has finished');
    },
    true,
    'America/New_York'
);*/

imageDownload();

function imageDownload() {
    var imageUriUniq = [];
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
         // channel images
         function(callback) {
             Image.find({type: 'channel'}, function(err, images) {
                 if(err) {
                     logger.logError('imageProcessorMain - imageDownload - failed to retrieve channel images from db with error: ' + err);
                 } else {
                     logger.logInfo('imageProcessorMain - imageDownload - images type channel found in db: ' + images.length);
                     
                     for(var i = 0; i < images.length; i++) {
                         imageUriUniq.push({uri: images[i].images[0].preferredImage.uri, type: images[i].type, status: 'saved', id: images[i].identifier});
                         imageUriUniq = _.uniq(imageUriUniq, 'uri');
                     }
                     imageCount = imageUriUniq.length;
                     logger.logInfo('imageProcessorMain - imageDownload - unique images type channel found in db: ' + imageUriUniq.length);
                 }
                 callback(err, images);
             });
         }, 
         
         function(images, callback) {
             graceNote.getChannelList(function (err, data) {
                 if (err) {
                     logger.logError('imageProcessorMain - imageDownload - gracenote error: ' + err);
                     callback(err);
                     return;
                 } else {
                     logger.logInfo('imageProcessorMain - imageDownload - gracenote channel list length: ' + data.length);
                 }
                 
                 // save channel image into db
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
                 
                 logger.logInfo('imageProcessorMain - imageDownload - initial images length: ' + imageUri.length);
                 
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
                 logger.logInfo('imageProcessorMain - imageDownload - unique images type channel found in gracenote: ' + (imageUriUniq.length - imageCount));

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
                             logger.logError('imageProcessorMain - saveImage - type channel failed with err: ' + err);
                             callback(err);
                             return;
                         } else {
                             logger.logInfo('imageProcessorMain - saveImage - type channel succeed! ');
                         }
                         callback(null, images, data);
                     }
                 );
             });
         },
         
         function(images, data, callback) {
             
             imageUriUniq.splice(0, imageCount);
             logger.logInfo('imageProcessorMain - imageDownload - channel images to download: ' + imageUriUniq.length);
             
             if(imageUriUniq.length > 0) {
                 async.eachSeries(
                     imageUriUniq,
                     function (item, cb) {
                         if(isSaveImageToDb) {
                             var fileNameIndex = item.uri.lastIndexOf("/") + 1;
                             var filename = item.uri.slice(fileNameIndex);
                             saveImageToDb(config.graceNoteImageUrl, item.uri, filename, cb);
                         } else {
                             var filename = item.uri;
                             filename = 'images/channels/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                             download(config.graceNoteImageUrl+item.uri, filename, cb);
                         }
                     },
                     function (err) {
                         if(err) {
                             logger.logError('imageProcessorMain - download image status failed with err: ' + err);
                         } else {
                             logger.logInfo('imageProcessorMain - download image status succeed! ');
                         }
                         callback(err, data);
                     }
                 );
             } else {
                 logger.logInfo('imageProcessorMain - download - no new images found')
                 callback(null, data);
             }
         },
         // program images
         function(data, callback) {
             imageUriUniq.splice(0, imageUriUniq.length);
             imageCount = 0;
             logger.logInfo('imageProcessorMain - imageDownload - start program image download process');
             Image.find({type: 'program'}, function(err, images) {
                 if(err) {
                     logger.logError('imageProcessorMain - imageDownload - failed to retrieve program images from db with error: ' + err);
                 } else {
                     logger.logInfo('imageProcessorMain - imageDownload - images type program found in db: ' + images.length);
                     imageCount = images.length;
                     for(var i = 0; i < images.length; i++) {
                         imageUriUniq.push({uri: images[i].images[0].preferredImage.uri, type: images[i].type, status: 'saved', id: images[i].identifier});
                     }
                 }
                 callback(err, images, data);
             });
         }, 
         
         function(images, data, callback) {
             async.eachSeries(
                 data, 
                 function (channelGraceNote, cb) {
                     graceNote.getChannelGuide(channelGraceNote.stationId, startTime, endTime, function (err, dataPrograms) {
                         if (err) {
                             logger.logError('imageProcessorMain - imageDownload - failed to getChannelGuide from gracenote with error: ' + err);
                             cb(err);
                             return;
                         } else {
                             var airings = dataPrograms[0].airings;
                             logger.logInfo('imageProcessorMain - imageDownload - programs retrieved from gracenote in total: ' + airings.length);
                             
                             var imageUri = [];
                             for(var i = 0; i < airings.length; i++) {
                                 imageUri.push({uri: airings[i].program.preferredImage.uri, type: 'program', status: 'new', id: airings[i].program.tmsId});
                             }
                             
                             logger.logInfo('imageProcessorMain - imageDownload - initial program images length: ' + imageUri.length);
                             
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
                             
                             var imageNewCount = imageUriUniq.length - imageUriUniqCount;
                             logger.logInfo('imageProcessorMain - imageDownload - unique program images added: ' + imageNewCount);
                             
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
                                         logger.logError('imageProcessorMain - saveImage - type program failed with err: ' + err);
                                         cb(err);
                                         return;
                                     } else {
                                         logger.logInfo('imageProcessorMain - saveImage - type program succeed! ');
                                     }
                                     cb(err, images, data);
                                 }
                             );
                         }
                     });
                 },
                 function (err) {
                     if(err) {
                         logger.logError('imageProcessorMain - saveImage - error save/update images: ' + err);
                     } else {
                         logger.logInfo('imageProcessorMain - gracenote retrieval succeed! ');
                     }
                     callback(err, images, data);
                 }
             );
         },
         
         function(images, data, callback) {
             
             imageUriUniq.splice(0, imageCount);
             logger.logInfo('imageProcessorMain - imageDownload - program images to download: ' + imageUriUniq.length);
             
             if(imageUriUniq.length > 0) {
                 async.eachSeries(
                     imageUriUniq,
                     function (item, cb) {
                         if(isSaveImageToDb) {
                             var fileNameIndex = item.uri.lastIndexOf("/") + 1;
                             var filename = item.uri.slice(fileNameIndex);
                             saveImageToDb(config.graceNoteImageUrl, item.uri, filename, cb);
                         } else {
                             var filename = item.uri;
                             filename = 'images/programs/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                             download(config.graceNoteImageUrl+item.uri, filename, cb);
                         }
                     },
                     function (err) {
                         if(err) {
                             logger.logError('imageProcessorMain - download image status failed with err: ' + err);
                         } else {
                             logger.logInfo('imageProcessorMain - download image status succeed! ');
                         }
                         callback(err, images, data);
                     }
                 );
             } else {
                 logger.logInfo('imageProcessorMain - download - no new images found')
                 callback(null, images, data);
             }
         }
         ], 
         
         function(err) {
         if (err) {
             logger.logError('imageProcessorMain - imageDownload - error: ' + err);
             process.exit(1);
         } else {
             logger.logInfo('imageProcessorMain - imageDownload succeed!');
             process.exit(0);
         }
         
    });
}

function saveImage(channel, type, identifier, cb) {

    var newImage = new Image(channel);
    
    newImage.type = type;
    newImage.identifier = identifier;
    newImage.images.push({preferredImage: channel.preferredImage, active: true, source: 'gracenote'});
    newImage.save(function (err) {
        if (cb) {
            cb(err, newImage);
        }
    });
}

function saveImageToDb(configUrl, uri, filename, cb) {
    request.head(configUrl + uri, function(err, res, body) {
        if (err) {
            logger.logError('imageProcessorMain - download - failed to require head info');
            logger.logError(err);
            cb(err, filename);
        } else {
            logger.logInfo('imageProcessorMain - download - content-type:' + res.headers['content-type']);
            logger.logInfo('imageProcessorMain - download - content-length:' + res.headers['content-length']);
            
            var requestTemp = request.defaults({encoding: null});
            var img = new ImageData({
               name: filename,
               uri: uri,
               contentType: res.headers['content-type']
            });
            
            requestTemp.get(configUrl + uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //if(response.headers["content-type"] === null) {
                    //    img.data = "data:" + "content-type:image; charset=utf-8" + ";base64," + new Buffer(body).toString('base64');
                    //} else {
                        img.data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                    //}
                    
                    img.save(function(err) {
                        if(cb) {
                            cb(err, img);
                        }
                    });
                } else {
                    if(error) {
                        logger.logError('imageProcessorMain - saveImageToDb - failed');
                        logger.logError(error);
                        if(cb) {
                            cb(err);
                        }
                    }
                }
            });
        }
     });
}
  
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
       if (err) {
           logger.logError('imageProcessorMain - download - failed to require head info with error: ' + err);
           callback(err, filename);
       } else {
           logger.logInfo('imageProcessorMain - download - content-type:' + res.headers['content-type']);
           logger.logInfo('imageProcessorMain - download - content-length:' + res.headers['content-length']);
           var stream = request(uri);
           stream.pipe(
               fs.createWriteStream(filename).on('error', function(err) {
                   logger.logError('imageProcessorMain - download - failed to createWriteStream with error: ' + err);
                   stream.read();
               })
           )
           .on('close', function() {
               callback(null, filename);
           });
       }
    });
};
  
function removeCollections() {
    Image.remove({}, function(err, removed) {
        if(err) {
            logger.logError('imageProcessorMain - removeCollections - failed to remove the collections!');
        } else {
            logger.logInfo('imageProcessorMain - removeCollections - collections removed: ' + removed);
        }
    });
}