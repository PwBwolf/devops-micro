'use strict';

var htmlparser = require('htmlparser2'),
    fs = require('fs'),
    translations = {},
    translate = null,
    translationString = '';


var parser = new htmlparser.Parser({
    onopentag: function (name, attribs) {
        if (attribs.translate) {
            translationString = '';
            console.log(attribs.translate);
            translate = attribs.translate;
        }
        else {
            translate = null;
        }
    },
    ontext: function (text) {
        if (translate !== null) {
            translationString += text;
        }
    },
    onclosetag: function () {
        if (translate !== null) {
            translations[translate] = translationString.replace(/(\r\n|\n|\r|\s+)/gm, ' ').replace('\'', '&#39;').trim();
        }
    }
});

if (typeof process.argv[2] !== 'undefined') {
    fs.readFile(process.argv[2], {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            parser.write(data);
            parser.end();
            if (typeof process.argv[3] !== 'undefined') {
                writeToFile(process.argv[3]);
            }
            else {
                writeToFile(process.argv[2].substring(0, process.argv[2].lastIndexOf('/')) + '/output.txt');
            }
        } else {
            console.log('Error reading file : ' + err);
        }

    });
}
else {
    console.log('No file specified');
}

var writeToFile = function (outputFile) {
    var translation = null;
    fs.writeFile(outputFile, '', function (err, data) {
        if (!err) {
            for (translation in translations) {
                fs.appendFile(outputFile, translation + ': \'' + translations[translation] + '\'\n', function (err) {
                    if (!err) {
                        console.log('Translation added to file successfully');
                    }
                    else {
                        console.log('Error while adding translation ' + translation + 'to output file', err);
                    }
                });
            }
        }
        else {
            console.log('Error while removing old data from output file :', err);
        }
    });
};
