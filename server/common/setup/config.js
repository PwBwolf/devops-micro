'use strict';

var _ = require('lodash');

module.exports = _.extend(
    require(__dirname + '/../config/all.js'),
    require(__dirname + '/../config/' + process.env.NODE_ENV + '.js') || {}
);
