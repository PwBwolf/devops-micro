'use strict';

var fs = require('fs'),
    async = require('async'),
    config = require('./config.js');

async.waterfall([
    // read web-slider.json
    function (callback) {

    },
    // check all image files exist
    function (callback) {

    },
    // check all image files are of the correct resolution
    function (callback) {

    },
    // create user in FreeSide
    function (callback) {


    },
    // send verification email
    function (callback) {

        callback(accountObj);
    },
    // delete user from visitor
    function (callback) {

    }
], function (err) {
    if (err) {
        throw err;
    }
    console.log('Success');
    return 0;
});


fs.readFile('web-slider.json', 'utf8', function (err, data) {






    if (err) {
        console.log('Error reading web-slider.json file. Check if file is present.');
        throw err;
    } else {
        var sliderData;
        try {
            sliderData = JSON.parse(data);
        } catch(ex) {
            console.log('Error parsing web-slider.json file. Correct format errors and try again.');
            throw ex;
        }
        if(sliderData) {
            console.log('all good');
        } else {
            console.log('web-slider.json file is empty');
            throw new Error('empty file');
        }
    }
});

/*
if (typeof process.argv[2] !== 'undefined') {
    var bitmap = fs.readFileSync(process.argv[2]);
    // convert binary data to base64 encoded string
    var base64img = new Buffer(bitmap).toString('base64');
    console.log(base64img);
}
else {
    console.log('No file specified');
}
*/
