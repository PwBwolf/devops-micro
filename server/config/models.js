'use strict';

var fs = require('fs');

module.exports = function walk(path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file,
            stat = fs.statSync(newPath);

        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
