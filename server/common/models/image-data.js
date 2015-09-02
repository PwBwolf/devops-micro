'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageData = new Schema({
    name: String, 
    uri: String,
    contentType: String,
    data: Buffer
    }, {collection: 'ImageDatas'});

mongoose.model('ImageData', ImageData);