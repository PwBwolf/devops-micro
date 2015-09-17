'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('../../../server/node_modules/cron').CronJob;
var config = require('../../../server/common/setup/config');
var mongoose = require('../../../server/node_modules/mongoose');
var async = require('../../../server/node_modules/async');
var logger = require('../../../server/common/setup/logger');
var fs = require('../../../server/node_modules/fs-extended');
var xlsx = require('./node_modules/xlsx');
var xml2js = require('./node_modules/xml2js');

require('./models/airing');
require('./models/epg');
require('./models/event');

var dbYip = mongoose.createConnection(config.yipMetaDataDb);
//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.8/yipmetadata'); // integration
//var dbYip = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.11/yipmetadata'); // test

var Airing = dbYip.model('Airing');
var Epg = dbYip.model('Epg');
var Event = dbYip.model('Event');

var daysKeep = config.graceNoteDaysKeep;

if(daysKeep < 0 || daysKeep === undefined) {
    daysKeep = 5;
}

/*
//new CronJob(config.metaDataRetrievalRecurrence, function () {
new CronJob('0 14 20 * * *', function () {
        xmlXlsxParser();
    }, 
    function () {
        logger.logInfo('xmlXlsxParserMain - CronJob - parsing xml/xlsx files has finished');
    },
    true,
    'America/New_York'
);*/

xmlXlsxParser();

function xmlXlsxParser() {
    var now = new Date(); 
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setDate(now.getDate() - daysKeep);
    var startUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    var xlsxFiles = [], xmlFiles = [];
    var path = '/files';
    var fullPath = __dirname + path;
    var files = fs.readdirSync(fullPath);
    for(var i = 0; i < files.length; ++i) {
        if(fs.statSync(fullPath + '/' + files[i]).isFile()) {
            var ext =  files[i].split('.').pop().toLowerCase();
            switch(ext) {
            case 'xlsx':
                xlsxFiles.push(fullPath + '/' + files[i]);
                break;
            case 'xml':
                xmlFiles.push(fullPath + '/' + files[i]);
                break;
            }
        }
    }

    async.waterfall([
        function(callback) {
            async.eachSeries(
                xlsxFiles,
                function(xlsxFile, cb) {
                    xlsxParser(xlsxFile, startUtc, cb);
                },
                function(err) {
                    if(err) {
                        logger.logError('xmlXlsxParserMain - async.waterfall - failed to parser xlsx file');
                        logger.logError(err);
                    } else {
                        logger.logInfo('xmlXlsxParserMain - parsing xlsx files succeed');
                    }
                    callback(err);
                }
            );
        }, 
        
        function(callback) {
            async.eachSeries(
                xmlFiles,
                function(xmlFile, cb) {
                    xmlParser(xmlFile, startUtc, cb);
                },
                function(err) {
                    if(err) {
                        logger.logError('xmlXlsxParserMain - async.waterfall - failed to parser xml files');
                        logger.logError(err);
                    } else {
                        logger.logInfo('xmlXlsxParserMain - parsing xml files succeed');
                    }
                    callback(err);
                }
            );
        }], 
        
        function(err) {
            if (err) {
                logger.logError('xmlXlsxParserMain - parsing xlsx/xml files failed');
                logger.logError(err);
            } else {
                logger.logInfo('xmlXlsxParserMain - parsing xlsx/xml files succeed!');
            }
        }
    );
}

function xlsxParser(xlsxFileName, startUtc, xlsxCb) {
    var fileName = xlsxFileName ? xlsxFileName : __dirname + '/xlsx/FightBox_September_2015_UTC.xlsx';
    var workbook = xlsx.readFile(fileName);
    var channelSource = getChannelSourceUpperCase(fileName);
    
    async.waterfall([
        function(callback) {
            Airing.find({source: channelSource}, function(err, airings) {
               if(err) {
                   logger.logError('xmlXlsxParserMain - xlsxParser - failed to retrieve documents from: ' + channelSource + ' in db');
                   logger.logError(err);
               } else {
                   logger.logInfo('xmlXlsxParserMain - xlsxParser - documents found from: ' + channelSource + ' in db: ' + airings.length);
               }
               callback(err, airings);
            });
        },
        
        function(airingsDb, callback) {
            var airing;
            if(airingsDb.length > 0) {
                airing = airingsDb[0];
                airing.fileName = fileName;
            } else {
                airing = new Airing({source: channelSource, type: 'xlsx', fileName: fileName});
            }
            async.eachSeries(
                workbook.SheetNames, 
                function(sheetName, cb) {
                    
                    var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    logger.logInfo('xmlXlsxParserMain - xlsxParser - save sheet name: ' + sheetName + ' from ' + channelSource + ': length: ' + roa.length);
                    if(roa.length > 0) {
                        saveSheet(airing, roa, fileName, cb);
                    } else {
                        cb(null);
                    }
                },
                function (err) {
                    if(err) {
                        logger.logError('xmlXlsxParserMain - xlsxParser - failed to parse xlsx file from: ' + channelSource);
                        logger.logError(err);
                    } else {
                        logger.logInfo('xmlXlsxParserMain - xlsxParser - succeeded to parse xlsx file from: ' + channelSource);
                    }
                    callback(err, airing);
                }
            );
        },
        
        function(airing, callback) {
            var count = 0;
            for(var i = 0; i < airing.airings.length; ++i) {
                if(airing.airings[i].startTime > startUtc) {
                    count = i;
                    break;
                }       
            }
            if(count > 0) {
                logger.logInfo('xmlXlsxParserMain - xlsxParser - airings removed: ' + count);
                airing.airings.splice(0, count);
                airing.save(function(err) {
                    logger.logInfo('xmlXlsxParserMain - xlsxParser - airings left: ' + airing.airings.length);
                    callback(err);
                });
            } else {
                logger.logInfo('xmlXlsxParserMain - xlsxParser - no airings need to be removed');
                callback(null);
            }
                
        }],
        
        function(err) {
            if (err) {
                logger.logError('xmlXlsxParserMain - xlsxParser - xlsx parse failed');
                logger.logError(err);
            } else {
                logger.logInfo('xmlXlsxParserMain - xlsxParser - xlsx parse succeed!');
            }
            if(xlsxCb) {
                xlsxCb(err);
            }
    });
}

function getChannelSourceUpperCase(name) {
    var fileName = name.split('\\').pop().split('/').pop();
    return fileName.split('_').shift().toUpperCase();
}

function saveSheet(airing, data, name, callback) {
    if(airing.airings.length > 0) {
        var startDateString = data[0]['Start date'] ? data[0]['Start date'] : data[0]['DATE'] ? data[0]['DATE'] : data[0]['Date'];
        var startYear, startMonth, startDay;
        if(startDateString === undefined) {
            startDateString = '21000901';
        } else {
            if(startDateString.indexOf('.') > -1) {
                startDateString = startDateString.split('.');
                startYear = startDateString[2];
                startMonth = startDateString[1];
                startDay = startDateString[0];
            } else {
                startYear = startDateString.substring(0,4);
                startMonth = startDateString.substring(4,6);
                startDay = startDateString.substring(6,8);
            }
        }

        var startTimeString = data[0]['Start time'] ? data[0]['Start time'] : data[0]['START TIME'];
        if(startTimeString === undefined) {
            startTimeString = '10:10:10';
        }
        var startHour, startMin, startSec;
        var pieces = startTimeString.split(':');
        if(pieces) {
            if(pieces.length === 3) {
                startHour = parseInt(pieces[0], 10);
                startMin = parseInt(pieces[1], 10);
                startSec = parseInt(pieces[2], 10);
            } else if(pieces.length === 2) {
                startHour = parseInt(pieces[0], 10);
                startMin = parseInt(pieces[1], 10);
                startSec = 0;
            } else {
                startHour = 0;
                startMin = 0;
                startSec = 0;
            }
        }
        
        var sT = new Date(Date.UTC(startYear, startMonth-1, startDay, startHour, startMin, startSec));
        var isSTExist = false;
        var index = 0;
        for(; index < airing.airings.length; ++index) {
            if(airing.airings[index].startTime >= sT) {
                isSTExist = true;
                break;
            }
        }
        if(isSTExist) {
            logger.logInfo('xmlXlsxParserMain - saveSheet - airings removed from db before adding new airings: ' + (airing.airings.length - index));
            airing.airings.splice(index, airing.airings.length - index);
        }
    }

    var keys = Object.keys(data ? data[0] : data);
    var newFields = findNewFields(keys);
    
    for(var i = 0; i < data.length; ++i) {
        var startDateString = data[i]['Start date'] ? data[i]['Start date'] : data[i]['DATE'] ? data[i]['DATE'] : data[i]['Date'];
        var startYear, startMonth, startDay;
        if(startDateString) {
            if(startDateString.indexOf('.') > -1) {
                startDateString = startDateString.split('.');
                startYear = startDateString[2];
                startMonth = startDateString[1];
                startDay = startDateString[0];
            } else {
                startYear = startDateString ? startDateString.substring(0,4) : undefined;
                startMonth = startDateString ? startDateString.substring(4,6) : undefined;
                startDay = startDateString ? startDateString.substring(6,8) : undefined;
            }
        }
        var startTimeString = data[i]['Start time'] ? data[i]['Start time'] : data[i]['START TIME'];
        var startHour, startMin, startSec;
        var pieces = startTimeString ? startTimeString.split(':') : undefined;
        if(pieces) {
            if(pieces.length === 3) {
                startHour = parseInt(pieces[0], 10);
                startMin = parseInt(pieces[1], 10);
                startSec = parseInt(pieces[2], 10);
            } else if(pieces.length === 2) {
                startHour = parseInt(pieces[0], 10);
                startMin = parseInt(pieces[1], 10);
                startSec = 0;
            } else {
                startHour = 0;
                startMin = 0;
                startSec = 0;
            }
        }
        
        var endDateString = data[i]['End date'] ? data[i]['End date'] : data[i]['End date'];
        var endYear = endDateString ? endDateString.substring(0,4) : undefined;
        var endMonth = endDateString ? endDateString.substring(4,6) : undefined;
        var endDay = endDateString ? endDateString.substring(6,8) : undefined;
        var endTimeString = data[i]['End time'] ? data[i]['End time'] : data[i]['End time'];
        var endHour, endMin, endSec;
        pieces = endTimeString ? endTimeString.split(':') : undefined;
        if(pieces) {
            if(pieces.length === 3) {
                endHour = parseInt(pieces[0], 10);
                endMin = parseInt(pieces[1], 10);
                endSec = parseInt(pieces[2], 10);
            } else if(pieces.length === 2) {
                endHour = parseInt(pieces[0], 10);
                endMin = parseInt(pieces[1], 10);
                endSec = 0;
            } else {
                endHour = 0;
                endMin = 0;
                endSec = 0;
            }
        }
        var epg = new Epg({
            lp: data[i]['Lp.'] ? data[i]['Lp.'] : data[i]['LP.'], 
            title: data[i]['Title'] ? data[i]['Title'] : data[i]['TITLE'],
            synopsis: data[i]['Synopsis'] ? data[i]['Synopsis'] : data[i]['Synopsis EN'] ? data[i]['Synopsis EN'] : data[i]['SYNOPSIS'],
            startTime: startDateString ? new Date(Date.UTC(startYear, startMonth-1, startDay, startHour, startMin, startSec)) : undefined,
            endTime: endDateString ? new Date(Date.UTC(endYear, endMonth-1, endDay, endHour, endMin, endSec)) : undefined,
            country: data[i]['Country'] ? data[i]['Country'] : data[i]['COUNTRY'],
            director: data[i]['DIRECTOR'],
            casting: data[i]['CASTING'],
            genre: data[i]['GENRE'],
            ageRating: data[i]['AGE RATING'],
            year: data[i]['YEAR'],
            day: data[i]['DAY'],
            duration: data[i]['TIME']
        });
        for(var j = 0; j < newFields.length; ++j) {
            logger.logInfo('xmlXlsxParserMain - saveSheet - new field found in the xlsx file: ' + name + ' with the new field ' + newFields[j]);
            var field = newFields[j].replace('.', '');
            epg.set(field, data[i][newFields[j]]);
        }
        airing.airings.push(epg);
    }

    airing.save(function(err) {
        if(callback) {
            logger.logInfo('xmlXlsxParserMain - saveSheet - total airings after saveSheet: ' + airing.airings.length);
            callback(err);
        }
    });
}

function findNewFields(keys) {
    var newFields = [];
    for(var i = 0; i < keys.length; ++i) {
        switch(keys[i]) {
        case 'Start date':
        case 'Date':
        case 'DATE':
            break;
        case 'Start time':
        case 'START TIME':
            break;
        case 'End date':
            break;
        case 'End time':
            break;
        case 'Lp.':
        case 'LP.':
            break;
        case 'Title':
        case 'TITLE':
            break;
        case 'Synopsis':
        case 'SYNOPSIS':
        case 'Synopsis EN':
            break;
        case 'Country':
        case 'COUNTRY':
            break;
        case 'DIRECTOR':
            break;
        case 'CASTING':
            break;
        case 'GENRE':
            break;
        case 'AGE RATING':
            break;
        case 'YEAR':
            break;
        case 'DAY':
            break;
        case 'TIME':
            break;
        default: 
            newFields.push(keys[i]);
        }
    }
    return newFields;
}

function xmlParser(xmlFileName, startUtc, xmlCb) {
    var fileName = xmlFileName ? xmlFileName : __dirname + '/xml/13082015223637_OnAir.xml';
    var parser = new xml2js.Parser({explicitArray: false});
    var channelSource = getChannelSourceUpperCase(fileName);
    
    async.waterfall([
        function(callback) {
            Event.find({source: channelSource}, function(err, events) {
               if(err) {
                   logger.logError('xmlXlsxParserMain - xmlParser - failed to retrieve documents from: ' + channelSource + ' in db');
                   logger.logError(err);
               } else {
                   logger.logInfo('xmlXlsxParserMain - xmlParser - documents found from: ' + channelSource + ' in db: ' + events.length);
               }
               callback(err, events);
            });
        },
        
        function(eventsDb, callback) {
            var event;
            if(eventsDb.length > 0) {
                event = eventsDb[0];
                event.fileName = fileName;
            } else {
                event = new Event({source: channelSource, type: 'xml', fileName: fileName});
            }
            fs.readFile(fileName, function(err, data) {
                parser.parseString(data, function(err, result) {
                    if(err) {
                        logger.logError('xmlXlsxParserMain - xmlParser - failed to parseString');
                        logger.logError(err);
                        callback(err, event);
                        return;
                    } else {
                        logger.logInfo('xmlXlsxParserMain - xmlParser - save event into db: ' + result.PLAYLIST.EVENTLIST.EVENT.length);
                        if(result.PLAYLIST.EVENTLIST.EVENT.length > 0) {
                            saveEvent(event, result.PLAYLIST.EVENTLIST.EVENT, result.PLAYLIST.MEDIALIST.MEDIA, callback);
                        } else {
                            logger.logInfo('xmlXlsxParserMain - xmlParser - no event to be saved in db');
                            callback(null, event);
                        }
                    }
                });
            });
        },
        
        function(event, callback) {
            var count = 0;
            for(var i = 0; i < event.airings.length; ++i) {
                if(event.airings[i].startTime > startUtc) {
                    count = i;
                    break;
                }       
            }
            if(count > 0) {
                logger.logInfo('xmlXlsxParserMain - xmlParser - event airings removed: ' + count);
                event.airings.splice(0, count);
                event.save(function(err) {
                    logger.logInfo('xmlXlsxParserMain - xmlParser - event airings left: ' + airing.airings.length);
                    callback(err);
                });
            } else {
                logger.logInfo('xmlXlsxParserMain - xmlParser - no event airings need to be removed');
                callback(null);
            }
                
        }],
        
        function(err) {
            if (err) {
                logger.logError('xmlXlsxParserMain - xmlParser - xml parse failed from: ' + channelSource);
                logger.logError(err);
            } else {
                logger.logInfo('xmlXlsxParserMain - xmlParser - xml parse succeed from: ' + channelSource);
            }
            if(xmlCb) {
                xmlCb(err);
            }
    });
}

function saveEvent(event, data, dataMedia, cb) {
    if(event.airings.length > 0) {
        var startDateString = data[0]['OnAirDate'];
        var startYear = '20' + startDateString.substring(0,2);
        var startMonth = startDateString.substring(3,5);
        var startDay = startDateString.substring(6,8);
        var startTimeString = data[0]['OnAirTime'];
        var startHour, startMin, startSec, startMilSec;
        var pieces = startTimeString.split(':');
        if(pieces.length === 4) {
            startHour = parseInt(pieces[0], 10);
            startMin = parseInt(pieces[1], 10);
            startSec = parseInt(pieces[2], 10);
            startMilSec = parseInt(pieces[3], 10);
        } else {
            startHour = 0;
            startMin = 0;
            startSec = 0;
            startMilSec = 0;
        }
        
        var sT = new Date(Date.UTC(startYear, startMonth-1, startDay, startHour, startMin, startSec, startMilSec));
        var isSTExist = false;
        var index = 0;
        for(; index < event.airings.length; ++index) {
            if(event.airings[index].startTime >= sT) {
                isSTExist = true;
                break;
            }
        }
        if(isSTExist) {
            logger.logInfo('xmlXlsxParserMain - saveEvent - airings removed from db before adding new airings: ' + (event.airings.length - index));
            event.airings.splice(index, event.airings.length - index);
        }
    }
    for(var i = 0; i < data.length; ++i) {
        var startDateString = data[i]['OnAirDate'];
        var startYear = '20' + startDateString.substring(0,2);
        var startMonth = startDateString.substring(3,5);
        var startDay = startDateString.substring(6,8);
        var startTimeString = data[i]['OnAirTime'];
        var startHour, startMin, startSec, startMilSec;
        var pieces = startTimeString.split(':');
        if(pieces.length === 4) {
            startHour = parseInt(pieces[0], 10);
            startMin = parseInt(pieces[1], 10);
            startSec = parseInt(pieces[2], 10);
            startMilSec = parseInt(pieces[3], 10);
        } else {
            startHour = 0;
            startMin = 0;
            startSec = 0;
            startMilSec = 0;
        }
        
        var xmlAttr = data[i]['$'];
        var xmlDvbEventClass = data[i]['DvbEventClass'] ? getDvbEventClass(Number(data[i]['DvbEventClass'])) : data[i]['DvbEventClass'];
        var xmlAspectRatio;
        if(data[i]['Aspectratio']) {
            xmlAspectRatio = getAspectRatio(Number(data[i]['Aspectratio']));
        } else {
            xmlAspectRatio = getAspectRatioFromMedia(dataMedia, data[i]['Title']);
        }

        event.airings.push({
            attributeType: xmlAttr['TYPE'],
            title: data[i]['Title'],
            startTime: new Date(Date.UTC(startYear, startMonth-1, startDay, startHour, startMin, startSec, startMilSec)),
            duration: data[i]['Duration'],
            mediaId: data[i]['MediaId'],
            pGuidance: data[i]['PGuidance'],
            category: data[i]['Category'],
            eitName: data[i]['EitName'],
            eitShort: data[i]['EitShort'],
            eitLong: data[i]['EitLong'],
            eit: data[i]['Eit'],
            dvbEventClass: xmlDvbEventClass,
            aspectRatio: xmlAspectRatio,
            thirdPartyId: data[i]['ThirdPartyId'],
            playerGroupId: data[i]['PlayerGroupId'],
            offset: data[i]['OffSet'],
            wssEnable: data[i]['WssEnable'],
            eitStop: data[i]['EitStop']
        });
    }

    event.save(function(err) {
        if(cb) {
            logger.logInfo('xmlXlsxParserMain - saveEvent - total airings after saveEvent: ' + event.airings.length);
            cb(err, event);
        }
    });
}

function getDvbEventClass(index) {
    var eventClassification = 'Unknown';
    switch (index) {
    case 0: 
        eventClassification = 'Undefined content';
        break;
    case 16:
        eventClassification = 'Movie/drama (general)';
        break;
    case 17:
        eventClassification = 'Detective/thriller';
        break;
    case 18:
        eventClassification = 'Adventure/western/war';
        break;
    case 19:
        eventClassification = 'Science fiction/fantasy/horror';
        break;
    case 20:
        eventClassification = 'Comedy';
        break;
    case 21:
        eventClassification = 'Soap/melodrama/folkloric';
        break;
    case 22: 
        eventClassification = 'Romance';
        break;
    case 23:
        eventClassification = 'Serious/classical/religious/historical movie/drama';
        break;
    case 24:
        eventClassification = 'Adult movie/drama';
        break;
    case 32:
        eventClassification = 'News/current affairs (general)';
        break;
    case 33:
        eventClassification = 'News/weather report';
        break;
    case 34:
        eventClassification = 'News magazine';
        break;
    case 35:
        eventClassification = 'Documentary';
        break;
    case 36:
        eventClassification = 'Discussion/interview/debate';
        break;
    case 48:
        eventClassification = 'Show/game show (general)';
        break;
    case 49:
        eventClassification = 'Game show/quiz/contest';
        break;
    case 50:
        eventClassification = 'Variety show';
        break;
    case 51:
        eventClassification = 'Talk show';
        break;
    case 64:
        eventClassification = 'Sports (general)';
        break;
    case 65:
        eventClassification = 'Special events (olympic games, world cup, etc.)';
        break;
    case 66:
        eventClassification = 'Sports magazines';
        break;
    case 67:
        eventClassification = 'Football/soccer';
        break;
    case 68:
        eventClassification = 'Tennis squash';
        break;
    case 69:
        eventClassification = 'Team sports (excluding football)';
        break;
    case 70:
        eventClassification = 'Athletics';
        break;
    case 71:
        eventClassification = 'Motor sport';
        break;
    case 72:
        eventClassification = 'Water sport';
        break;
    case 73:
        eventClassification = 'Winter sports';
        break;
    case 74:
        eventClassification = 'Equestrian';
        break;
    case 75:
        eventClassification = 'Martial sports';
        break;
    case 80:
        eventClassification = 'Children´s/youth programs (general)';
        break;
    case 81:
        eventClassification = 'Pre-school children´s programs';
        break;
    case 82:
        eventClassification = 'Entertainment programs for 6 to 14';
        break;
    case 83:
        eventClassification = 'Entertainment programs for 10 to 16';
        break;
    case 84:
        eventClassification = 'Informational/educational/school programs';
        break;
    case 85:
        eventClassification = 'Cartoons/puppets';
        break;
    case 96:
        eventClassification = 'Music/ballet/dance (general)';
        break;
    case 97:
        eventClassification = 'Rock/pop';
        break;
    case 98:
        eventClassification = 'Serious music/classical music';
        break;
    case 99:
        eventClassification = 'Folk/traditional/music';
        break;
    case 100:
        eventClassification = 'Jazz';
        break;
    case 101:
        eventClassification = 'Musical/opera';
        break;
    case 102:
        eventClassification = 'Ballet';
        break;
    case 112:
        eventClassification = 'Arts/culture (without music, general)';
        break;
    case 113:
        eventClassification = 'Performing arts';
        break;
    case 114:
        eventClassification = 'Fine arts';
        break;
    case 115:
        eventClassification = 'Religion';
        break;
    case 116:
        eventClassification = 'Popular culture/traditional arts';
        break;
    case 117:
        eventClassification = 'Literature';
        break;
    case 118:
        eventClassification = 'Film/cinema';
        break;
    case 119:
        eventClassification = 'Experimental film/video';
        break;
    case 120:
        eventClassification = 'Broadcasting/press';
        break;
    case 121:
        eventClassification = 'New media';
        break;
    case 122:
        eventClassification = 'Arts/culture magazines';
        break;
    case 123:
        eventClassification = 'Fashion';
        break;
    case 128:
        eventClassification = 'Social/political issues/economics (general)';
        break;
    case 129:
        eventClassification = 'Magazines/reports/documentary';
        break;
    case 130:
        eventClassification = 'Economics/social advisory';
        break;
    case 131:
        eventClassification = 'Remarkable people';
        break;
    case 144:
        eventClassification = 'Education/science/factual topics (general)';
        break;
    case 145:
        eventClassification = 'Nature/animals/environment';
        break;
    case 146:
        eventClassification = 'Technology/natural sciences';
        break;
    case 147:
        eventClassification = 'Medicine/physiology/psychology';
        break;
    case 148:
        eventClassification = 'Foreign countries/expeditions';
        break;
    case 149:
        eventClassification = 'Social/spiritual sciences';
        break;
    case 150:
        eventClassification = 'Further education';
        break;
    case 151:
        eventClassification = 'Languages';
        break;
    case 160:
        eventClassification = 'Leisure hobbies (general)';
        break;
    case 161:
        eventClassification = 'Tourism/travel';
        break;
    case 162:
        eventClassification = 'Handicraft';
        break;
    case 163:
        eventClassification = 'Motoring';
        break;
    case 164:
        eventClassification = 'Fitness and health';
        break;
    case 165:
        eventClassification = 'Cooking';
        break;
    case 166:
        eventClassification = 'Advertisement/shopping';
        break;
    case 167:
        eventClassification = 'Gardening';
        break;
    case 176:
        eventClassification = 'Original language';
        break;
    case 177:
        eventClassification = 'Black and white';
        break;
    case 178:
        eventClassification = 'Unpublished';
        break;
    case 179:
        eventClassification = 'Live broadcast';
        break;
    case 255:
        eventClassification = 'User defined';
        break;
    }
    return eventClassification;
}

function getAspectRatioFromMedia(data, title) {
    var aspectRatio = undefined;
    for(var i = 0; i < data.length; ++i) {
        if(data[i]['Media'].indexOf(title) > -1) {
            aspectRatio = getAspectRatio(Number(data[i]['Aspectratio']));
            break;
        }
    }
    return aspectRatio === 'Unknown' ? undefined : aspectRatio;
}

function getAspectRatio(index) {
    var aspectRatio = 'Unknown';
    switch(index) {
    case 0:
        aspectRatio = 'Full screen 4:3';
        break;
    case 1:
        aspectRatio = 'Letterbox 14:9 center';
        break;
    case 2:
        aspectRatio = 'Letterbox 14:9 top';
        break;
    case 3:
        aspectRatio = 'Letterbox 16:9 center';
        break;
    case 4:
        aspectRatio = 'Letterbox 16:9 top';
        break;
    case 5:
        aspectRatio = 'Letterbox >16:9 center';
        break;
    case 6:
        aspectRatio = 'Full-screen 14:9';
        break;
    case 7:
        aspectRatio = 'Full-screen 16:9';
        break;  
    }
    return aspectRatio;
}