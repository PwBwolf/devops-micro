'use strict';

var fs = require('fs');

if (typeof process.argv[2] !== 'undefined') {
    var bitmap = fs.readFileSync(process.argv[2]);
    // convert binary data to base64 encoded string
    var base64img = new Buffer(bitmap).toString('base64');
    console.log(base64img);
}
else {
    console.log('No file specified');
}
