'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    type: String, 
    identifier: String,
    images: [{preferredImage: {
        uri: String,
        height: String,
        width: String,
        size: String,
        aspect: String,
        text: String,
        primary: Boolean,
        category: String,
        tier: String,
        caption: {
            content: String,
            lang: String
        },
        personIds: [String]}, 
        active: Boolean,
        source: String}]
    }, {collection: 'Images'});

mongoose.model('Image', Image);