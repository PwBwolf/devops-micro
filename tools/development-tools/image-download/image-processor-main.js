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

//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.8/yiptv'); // integration
//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.11/yiptv'); // test
var dbYip = mongoose.createConnection(config.db);
var Image = dbYip.model('Image');

var daysRetrieve = 14;
var daysKeep = 5;

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
        logger.logInfo('image-processor-main - CronJob - gracenote retrieval has finished');
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
    
    async.waterfall([
         // channel images
         function(callback) {
             Image.find({type: 'channel'}, function(err, images) {
                 if(err) {
                     logger.logError('image-processor-main - imageDownload - failed to retrieve channel images from db with error: ' + err);
                 } else {
                     logger.logInfo('image-processor-main - imageDownload - images type channel found in db: ' + images.length);
                     imageCount = images.length;
                     for(var i = 0; i < images.length; i++) {
                         imageUriUniq.push({uri: images[i].preferredImage.uri, type: images[i].type, status: 'saved'});
                     }
                 }
                 callback(err, images);
             });
         }, 
         
         function(images, callback) {
             graceNote.getChannelList(function (err, data) {
                 if (err) {
                     logger.logError('image-processor-main - imageDownload - gracenote error: ' + err);
                     callback(err);
                     return;
                 } else {
                     logger.logInfo('image-processor-main - imageDownload - gracenote channel list length: ' + data.length);
                 }
                 
                 if(images.length === 0) {
                     var imageUri = [];
                     for(var i = 0; i < data.length; i++) {
                         imageUri.push({uri: data[i].preferredImage.uri, type: 'channel', status: 'new'});
                     }
                     
                     logger.logInfo('image-processor-main - imageDownload - initial images length: ' + imageUri.length);
                     
                     imageUriUniq = _.uniq(imageUri, 'uri');
                     
                     logger.logInfo('image-processor-main - imageDownload - unique images length: ' + imageUriUniq.length);
                     
                     async.eachSeries(
                         data,
                         function (dataGraceNote, cb) {
                             var imageUriCopy = true;
                             for(var i = 0; i < imageUriUniq.length; i++) {
                                 if(imageUriUniq[i].uri === dataGraceNote.preferredImage.uri && imageUriUniq[i].status === 'new') {
                                     imageUriUniq[i].status = 'saved';
                                     imageUriCopy = false;
                                     saveImage(dataGraceNote, 'channel', cb);
                                     break;
                                 }
                             }
                             if(imageUriCopy) {
                                 cb(null);
                             }
                         },
                         function (err) {
                             if(err) {
                                 logger.logError('image-processor-main - saveImage - type channel failed with err: ' + err);
                             } else {
                                 logger.logInfo('image-processor-main - saveImage - type channel succeed! ');
                             }
                             callback(err, images, data);
                         }
                     );
                 } else {
                     async.eachSeries(
                         data,
                         function (dataGraceNote, cb) {
                             var imageUriExist = false;
                             for(var i = 0; i < imageUriUniq.length; i++) {
                                 if(imageUriUniq[i].uri === dataGraceNote.preferredImage.uri && imageUriUniq[i].type === 'channel') {
                                     imageUriExist = true;
                                     break;
                                 }
                             }
                             if(imageUriExist) {
                                 cb(null);
                             } else {
                                 imageUriUniq.push({uri: dataGraceNote.preferredImage.uri, type: 'channel', status: 'saved'});
                                 saveImage(dataGraceNote, 'channel', cb);
                             }
                         },
                         function (err) {
                             if(err) {
                                 logger.logError('image-processor-main - saveImage - type channel failed with err: ' + err);
                             } else {
                                 logger.logInfo('image-processor-main - saveImage - type channel succeed! ');
                             }
                             callback(err, images, data);
                         }
                     );
                 }
             });
         },
         
         function(images, data, callback) {
             
             imageUriUniq.splice(0, imageCount);
             logger.logInfo('image-processor-main - imageDownload - channel images to download: ' + imageUriUniq.length);
             
             if(imageUriUniq.length > 0) {
                 async.eachSeries(
                     imageUriUniq,
                     function (item, cb) {
                         var filename = item.uri;
                         filename = 'images/channels/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                         download(config.graceNoteImageUrl+item.uri, filename, cb);
                     },
                     function (err) {
                         if(err) {
                             logger.logError('image-processor-main - download image status failed with err: ' + err);
                         } else {
                             logger.logInfo('image-processor-main - download image status succeed! ');
                         }
                         callback(err, data);
                     }
                 );
             } else {
                 logger.logInfo('image-processor-main - download - no new images found')
                 callback(null, data);
             }
         },
         // program images
         function(data, callback) {
             imageUriUniq.splice(0, imageUriUniq.length);
             imageCount = 0;
             logger.logInfo('image-processor-main - imageDownload - start program image download process');
             Image.find({type: 'program'}, function(err, images) {
                 if(err) {
                     logger.logError('image-processor-main - imageDownload - failed to retrieve program images from db with error: ' + err);
                 } else {
                     logger.logInfo('image-processor-main - imageDownload - images type program found in db: ' + images.length);
                     imageCount = images.length;
                     for(var i = 0; i < images.length; i++) {
                         imageUriUniq.push({uri: images[i].preferredImage.uri, type: images[i].type, status: 'saved'});
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
                             logger.logError('image-processor-main - imageDownload - failed to getChannelGuide from gracenote with error: ' + err);
                             cb(err);
                             return;
                         } else {
                             var airings = dataPrograms[0].airings;
                             logger.logInfo('image-processor-main - imageDownload - programs retrieved from gracenote in total: ' + airings.length);
                             
                             var imageUri = [];
                             for(var i = 0; i < airings.length; i++) {
                                 imageUri.push({uri: airings[i].program.preferredImage.uri, type: 'program', status: 'new'});
                             }
                             
                             logger.logInfo('image-processor-main - imageDownload - initial program images length: ' + imageUri.length);
                             
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
                             logger.logInfo('image-processor-main - imageDownload - unique program images added: ' + imageNewCount);
                             
                             async.eachSeries(
                                 airings,
                                 function (airing, cb1) {
                                     var imageUriCopy = true;
                                     for(var i = imageUriUniq.length-1, m = 0 ; m < imageNewCount; i--, m++) {
                                         if(imageUriUniq[i].uri === airing.program.preferredImage.uri && imageUriUniq[i].status === 'new') {
                                             imageUriUniq[i].status = 'saved';
                                             imageUriCopy = false;
                                             saveImage(airing.program, 'program', cb1);
                                             break;
                                         }
                                     }
                                     if(imageUriCopy) {
                                         cb1(null);
                                     }
                                 },
                                 function (err) {
                                     if(err) {
                                         logger.logError('image-processor-main - saveImage - type program failed with err: ' + err);
                                         cb(err);
                                         return;
                                     } else {
                                         logger.logInfo('image-processor-main - saveImage - type program succeed! ');
                                     }
                                     cb(err, images, data);
                                 }
                             );
                         }
                     });
                 },
                 function (err) {
                     if(err) {
                         logger.logError('image-processor-main - saveImage - error save/update images: ' + err);
                     } else {
                         logger.logInfo('image-processor-main - gracenote retrieval succeed! ');
                     }
                     callback(err, images, data);
                 }
             );
         },
         
         function(images, data, callback) {
             
             imageUriUniq.splice(0, imageCount);
             logger.logInfo('image-processor-main - imageDownload - program images to download: ' + imageUriUniq.length);
             
             if(imageUriUniq.length > 0) {
                 async.eachSeries(
                     imageUriUniq,
                     function (item, cb) {
                         var filename = item.uri;
                         filename = 'images/programs/'+filename.replace(/[^a-z0-9_.\-]/gi, "-").toLowerCase();
                         download(config.graceNoteImageUrl+item.uri, filename, cb);
                     },
                     function (err) {
                         if(err) {
                             logger.logError('image-processor-main - download image status failed with err: ' + err);
                         } else {
                             logger.logInfo('image-processor-main - download image status succeed! ');
                         }
                         callback(err, images, data);
                     }
                 );
             } else {
                 logger.logInfo('image-processor-main - download - no new images found')
                 callback(null, images, data);
             }
         }
         ], 
         
         function(err) {
         if (err) {
             logger.logError('image-processor-main - imageDownload - error: ' + err);
             process.exit(1);
         } else {
             logger.logInfo('image-processor-main - imageDownload succeed!');
             process.exit(0);
         }
         
    });
}

function saveImage(channel, type, cb) {

    var newImage = new Image(channel);
    
    newImage.type = type;
    newImage.source = 'gracenote';
    
    newImage.save(function (err) {
        if (cb) {
            cb(err, newImage);
        }
    });
}
  
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
       if (err) {
           logger.logError('image-processor-main - download - failed to require head info with error: ' + err);
           callback(err, filename);
       } else {
           logger.logInfo('image-processor-main - download - content-type:' + res.headers['content-type']);
           logger.logInfo('image-processor-main - download - content-length:' + res.headers['content-length']);
           var stream = request(uri);
           stream.pipe(
               fs.createWriteStream(filename).on('error', function(err) {
                   logger.logError('image-processor-main - download - failed to createWriteStream with error: ' + err);
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
            logger.logError('image-processor-main - removeCollections - failed to remove the collections!');
        } else {
            logger.logInfo('image-processor-main - removeCollections - collections removed: ' + removed);
        }
    });
}