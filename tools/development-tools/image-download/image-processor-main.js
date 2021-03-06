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

require('../../../server/common/models/image');
require('../../../server/common/models/image-data');

var dbYip = mongoose.createConnection(config.db);
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

//new CronJob(config.imageRetrievalRecurrence, function () {
new CronJob('0 14 20 * * *', function () {
        imageDownload();
    }, 
    function () {
        logger.logInfo('imageProcessorMain - CronJob - image retrieval has finished');
    },
    true,
    'America/New_York'
);

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
        // channel images
        function(callback) {
            Image.find({type: 'channel'}, function(err, images) {
                if(err) {
                    logger.logError('imageProcessorMain - imageDownload - failed to retrieve channel images from db');
                    logger.logError(err);
                } else {
                    logger.logInfo('imageProcessorMain - imageDownload - images type channel found in db: ' + images.length);
                    
                    for(var i = 0; i < images.length; i++) {
                        imageUriUniq.push({uri: images[i].preferredImage.uri, type: images[i].type, status: 'saved', id: images[i].identifier});
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
                    logger.logError('imageProcessorMain - imageDownload - gracenote error');
                    logger.logError(err);
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
                            logger.logError('imageProcessorMain - saveImage - type channel failed');
                            logger.logError(err);
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
                            logger.logError('imageProcessorMain - download image status failed');
                            logger.logError(err);
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
                    logger.logError('imageProcessorMain - imageDownload - failed to retrieve program images from db');
                    logger.logError(err);
                } else {
                    logger.logInfo('imageProcessorMain - imageDownload - images type program found in db: ' + images.length);
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
                    graceNote.getChannelGuide(channelGraceNote.stationId, startTime, endTime, function (err, dataPrograms) {
                        if (err) {
                            logger.logError('imageProcessorMain - imageDownload - failed to getChannelGuide from gracenote');
                            logger.logError(err);
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
                            imageUriTemp = imageUriTemp.concat(imageUriUniqTemp);
                            imageUriTemp = _.uniq(imageUriTemp, 'uri');
                            logger.logInfo('imageProcessorMain - imageDownload - accumulated unique program images in gracenote length: ' + imageUriTemp.length);
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
                                        logger.logError('imageProcessorMain - saveImage - type program failed');
                                        logger.logError(err);
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
                        logger.logError('imageProcessorMain - saveImage - error save/update images');
                        logger.logError(err);
                    } else {
                        logger.logInfo('imageProcessorMain - gracenote retrieval succeed! ');
                    }
                    callback(err, images, data);
                }
            );
        },
        
        function(images, data, callback) {
            
            imageUriUniqRemoved = imageUriUniq.splice(0, imageCount);
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
                            logger.logError('imageProcessorMain - download image status failed');
                            logger.logError(err);
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
        },
        
        // add imagedata into image as reference
        function(images, data, callback) {
            Image.find(function(err, images) {
                if(err) {
                    logger.logError('imageProcessorMain - imageDownload - failed to retrieve images from db');
                    logger.logError(err);
                    callback(err);
                    return;
                } else {
                    logger.logInfo('imageProcessorMain - imageDownload - images found in db: ' + images.length);
                    async.eachSeries(
                        images,
                        function(image, cb) {
                            ImageData.find({uri: image.preferredImage.uri}, function(err, data) {
                                if(err) {
                                    logger.logError('imageProcessorMain - imageDownload - failed to retrieve imageData from db');
                                    logger.logError(err);
                                    cb(err);
                                } else {
                                    if(data.length === 0) {
                                        logger.logError('imageProcessorMain - imageDownload - retrieve imageData from db return 0 with uri: ' + preferredImage.uri);
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
                                logger.logError('imageProcessorMain - failed to add imagedata into image as reference');
                                logger.logError(err);
                            } else {
                                logger.logInfo('imageProcessorMain - add imagedata into image as reference succeed! ');
                            }
                            callback(err, images);
                        }
                    );
                }
            });
        },
        
        // clean Image and ImageData db to remove unexisted program images
        function(imagesUri, callback) {
            
            logger.logInfo('imageProcessorMain - imageDownload - total program images from gracenote: ' + imageUriTemp.length);
            imageUriUniq = imageUriUniq.concat(imageUriUniqRemoved);
            logger.logInfo('imageProcessorMain - imageDownload - total old program images in db: ' + imageUriUniq.length);
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
            logger.logInfo('imageProcessorMain - imageDownload - total old program images to be removed: ' + countRemoved);
            callback(null, imagesTobeRemoved, countRemoved);
        },
        
        function(imagesRemoved, count, callback) {
            if(count === 0) {
                logger.logInfo('imageProcessorMain - imageDownload - no program images need to be removed from db');
                callback(null);
                return;
            } 
            logger.logInfo('imageProcessorMain - imageDownload - total image to be removed from Image and ImageData: ' + imagesRemoved.length);
            async.eachSeries(
                imagesRemoved,
                function(imageRemoved, cb) {
                    Image.find({type: 'program', 'preferredImage.uri': imageRemoved.uri}, function(err, removed) {
                        if(err) {
                            logger.logError('imageProcessorMain - imageDownload - failed to find to be removed image in Images');
                            logger.logError(err);
                            cb(err);
                            return;
                        } else {
                            logger.logInfo('imageProcessorMain - imageDownload - image to be removed found in Image: ' + removed.length);
                            if(removed.length === 0) {
                                logger.logInfo('imageProcessorMain - imageDownload - could not find the to be removed image: ' + imageRemoved.uri);
                                cb(err, removed);
                            } else {
                                ImageData.remove({_id: removed[0].dataId}, function(err) {
                                   if(err) {
                                       logger.logError('imageProcessorMain - imageDownload - failed to remove imagedata from ImageData collections');
                                       logger.logError(err);
                                       cb(err);
                                   } else {
                                       logger.logInfo('imageProcessorMain - imageDownload - remove imagedata from ImageData collection succeed');
                                       Image.remove({type: 'program', 'preferredImage.uri': imageRemoved.uri}, function(err) {
                                          if(err) {
                                              logger.logError('imageProcessorMain - imageDownload - failed to remove image from Image collectiomn');
                                              logger.logError(err);
                                              cb(err);
                                          } else {
                                              logger.logInfo('imageProcessorMain - imageDownload - remove image from Image collection succeed');
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
                        logger.logError('imageProcessorMain - failed to remove program images in db');
                        logger.logError(err);
                    } else {
                        logger.logInfo('imageProcessorMain - program image removal succeed! ');
                    }
                    callback(err, imagesRemoved);
                }
            );  
        }
        ], 
        
        function(err) {
        if (err) {
            logger.logError('imageProcessorMain - image processor - failed');
            logger.logError(err);
            process.exit(1);
        } else {
            logger.logInfo('imageProcessorMain - image processor succeed!');
            process.exit(0);
        }
        
    });
}

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
                    logger.logInfo('imageProcessorMain - download - content-type final:' + contentType);
                    img.data = "data:" + contentType + ";base64," + new Buffer(body).toString('base64');
                    
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
           logger.logError('imageProcessorMain - download - failed to require head info');
           logger.logError(err);
           callback(err, filename);
       } else {
           logger.logInfo('imageProcessorMain - download - content-type:' + res.headers['content-type']);
           logger.logInfo('imageProcessorMain - download - content-length:' + res.headers['content-length']);
           var stream = request(uri);
           stream.pipe(
               fs.createWriteStream(filename).on('error', function(err) {
                   logger.logError('imageProcessorMain - download - failed to createWriteStream');
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
  