'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');
var Schema = mongoose.Schema;
var Image = new Schema({
    source: String,
    type: String,
    preferredImage: {
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
        personIds: [String]
    }
}, {collection: 'Images'});

mongoose.model('Image', Image);