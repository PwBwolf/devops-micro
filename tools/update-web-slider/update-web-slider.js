'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    sizeOf = require('image-size'),
    readChunk = require('read-chunk'),
    imageType = require('image-type'),
    MongoClient = require('mongodb').MongoClient,
    config = require('./config.js');

var env;

if (typeof process.argv[2] === 'undefined') {
    env = 'integration';
} else if (_.contains(['development', 'integration', 'test', 'production', 'staging'], process.argv[2])) {
    env = process.argv[2];
} else {
    console.log('Environment parameter is missing or incorrect!\n\rUsage: node update-web-slider <environment>\r\nWhere environment can be development, integration, test, production or staging');
    process.exit(1);
}

async.waterfall([
    // read and parse web-slider.json
    function (callback) {
        fs.readFile('web-slider.json', 'utf8', function (err, data) {
            if (err) {
                console.log('Error reading web-slider.json file. Check if file is present.');
                callback(err);
            } else {
                var sliderData;
                try {
                    sliderData = JSON.parse(data);
                } catch (ex) {
                    console.log('Error parsing web-slider.json file. Correct format errors and try again.');
                    callback(new Error('File parse error'));
                }
                if (!sliderData || sliderData.length === 0) {
                    console.log('web-slider.json file is empty');
                    callback(new Error('File empty'));
                } else {
                    console.log('Successfully loaded web-slider.json file');
                    callback(null, sliderData);
                }
            }
        });
    },
    // validate all inputs
    function (sliderData, callback) {
        try {
            var error = false;
            for (var i = 0; i < sliderData.length; i++) {
                var slide = sliderData[i];
                if (!slide.order || typeof slide.order !== 'number') {
                    console.log('Invalid order for slide ' + (i + 1));
                    callback(new Error('Invalid order'));
                    error = true;
                } else if (slide.imageFile.en.length === 0) {
                    console.log('English image file not specified for slide ' + (i + 1));
                    callback(new Error('Empty image file'));
                    error = true;
                } else if (slide.imageFile.es.length === 0) {
                    console.log('Spanish image file not specified for slide ' + (i + 1));
                    callback(new Error('Empty image file'));
                    error = true;
                } else if (!fs.existsSync(slide.imageFile.en)) {
                    console.log('English image file does not exist for slide ' + (i + 1));
                    callback(new Error('Non-existent image file'));
                    error = true;
                } else if (!fs.existsSync(slide.imageFile.es)) {
                    console.log('Spanish image file does not exist for slide ' + (i + 1));
                    callback(new Error('Non-existent image file'));
                    error = true;
                } else if (fs.statSync(slide.imageFile.en).size > config.imageSize) {
                    console.log('English image file exceeds maximum file size for slide ' + (i + 1));
                    callback(new Error('Large image file'));
                    error = true;
                } else if (fs.statSync(slide.imageFile.es).size > config.imageSize) {
                    console.log('Spanish image file exceeds maximum file size for slide ' + (i + 1));
                    callback(new Error('Large image file'));
                    error = true;
                } else if (sizeOf(slide.imageFile.en).width !== config.imageWidth || sizeOf(slide.imageFile.en).height !== config.imageHeight) {
                    console.log('English image file does not match required image resolution for slide ' + (i + 1));
                    callback(new Error('Incorrect image resolution'));
                    error = true;
                } else if (sizeOf(slide.imageFile.es).width !== config.imageWidth || sizeOf(slide.imageFile.es).height !== config.imageHeight) {
                    console.log('Spanish image file does not match required image resolution for slide ' + (i + 1));
                    callback(new Error('Incorrect image resolution'));
                    error = true;
                } else if (imageType(readChunk.sync(slide.imageFile.en, 0, 12)).mime !== config.imageType) {
                    console.log('Incorrect English image type for slide ' + (i + 1));
                    callback(new Error('Incorrect image type'));
                    error = true;
                } else if (imageType(readChunk.sync(slide.imageFile.es, 0, 12)).mime !== config.imageType) {
                    console.log('Incorrect Spanish image type for slide ' + (i + 1));
                    callback(new Error('Incorrect image type'));
                    error = true;
                } else if (!slide.maps || !slide.maps.en || !slide.maps.es || slide.maps.en.length === 0 || slide.maps.es.length === 0) {
                    console.log('Map not defined correctly for slide ' + (i + 1));
                    callback(new Error('Map missing'));
                    error = true;
                } else {
                    var j, map;
                    for (j = 0; j < slide.maps.en.length; j++) {
                        map = slide.maps.en[j];
                        if (!_.contains(['rect', 'circle', 'poly'], map.shape)) {
                            console.log('Invalid shape for English image map for slide ' + (i + 1));
                            callback(new Error('Invalid shape'));
                            error = true;
                        } else if (map.coords.length === 0) {
                            console.log('Empty coords for English image map for slide ' + (i + 1));
                            callback(new Error('Empty coords'));
                            error = true;
                        } else if (map.url.length === 0) {
                            console.log('Empty url for English image map for slide ' + (i + 1));
                            callback(new Error('Empty url'));
                            error = true;
                        }
                    }
                    if (!error) {
                        for (j = 0; j < slide.maps.es.length; j++) {
                            map = slide.maps.es[j];
                            if (!_.contains(['rect', 'circle', 'poly'], map.shape)) {
                                console.log('Invalid shape for Spanish image map for slide ' + (i + 1));
                                callback(new Error('Invalid shape'));
                                error = true;
                            } else if (map.coords.length === 0) {
                                console.log('Empty coords for Spanish image map for slide ' + (i + 1));
                                callback(new Error('Empty coords'));
                                error = true;
                            } else if (map.url.length === 0) {
                                console.log('Empty url for Spanish image map for slide ' + (i + 1));
                                callback(new Error('Empty url'));
                                error = true;
                            }
                        }
                    }
                }
            }
            if (!error) {
                console.log('Successfully validated web-slider.json file data');
                callback(null, sliderData);
            }
        } catch (ex) {
            console.log('Incorrect web-slider.json file');
            callback(ex);
        }
    },
    // convert to base64 string
    function (sliderData, callback) {
        for (var i = 0; i < sliderData.length; i++) {
            var slide = sliderData[i];
            var imgEn = fs.readFileSync(slide.imageFile.en);
            var imgEs = fs.readFileSync(slide.imageFile.es);
            slide.image = {en: new Buffer(imgEn).toString('base64'), es: new Buffer(imgEs).toString('base64')};
        }
        console.log('Successfully converted images to base64 strings');
        callback(null, sliderData);
    },
    // delete existing slides
    function (sliderData, callback) {
        MongoClient.connect(config.db[env], function (err, db) {
            if (err) {
                console.log('Error connecting to database');
                callback(err);
            } else {
                var webSliders = db.collection('WebSliders');
                webSliders.remove({}, {w: 1}, function (err1) {
                    if (err1) {
                        console.log('Error deleting existing slides from DB');
                        callback(err1);
                    } else {
                        console.log('Successfully deleted existing slides from DB');
                        callback(null, sliderData, db, webSliders);
                    }
                });
            }
        });
    },
    // add new slides
    function (sliderData, db, webSliders, callback) {
        webSliders.insert(sliderData, {w: 1}, function (err) {
            if (err) {
                console.log('Error adding new slides to DB');
                callback(err);
            } else {
                console.log('Successfully added new slides to DB');
                callback(null, db);
            }
        });
    },
    // increment webSliderVersion in Versions collection
    function (db, callback) {
        var versions = db.collection('Versions');
        versions.findOne({}, function (err, data) {
            if (err) {
                console.log('Error retrieving Versions values from DB');
                callback(err);
            } else {
                if (!data) {
                    versions.insert({webSliderVersion: 1}, {w: 1}, function (err1) {
                        if (err1) {
                            console.log('Error inserting new document with webSliderVersion set to 1');
                            callback(err1);
                        } else {
                            console.log('Successfully inserted new document with webSliderVersion set to 1');
                            callback(null);
                        }
                    });
                } else if (!data.webSliderVersion) {
                    versions.update({}, {$set: {webSliderVersion: 1}}, {w: 1}, function (err1) {
                        if (err1) {
                            console.log('Error setting webSliderVersion to 1');
                            callback(err1);
                        } else {
                            console.log('Successfully set webSliderVersion to 1');
                            callback(null);
                        }
                    });
                } else {
                    versions.update({}, {$inc: {webSliderVersion: 1}}, {w: 1}, function (err2) {
                        if (err2) {
                            console.log('Error incrementing webSliderVersion');
                            callback(err2);
                        } else {
                            console.log('Successfully incremented webSliderVersion');
                            callback(null);
                        }
                    });
                }

            }
        });
    }
], function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log('Successfully updated the web sliders');
        process.exit(0);
    }
});

