'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');

var Schema = mongoose.Schema;

var Image = new Schema({
    type: String,   // channel or program
    identifier: String,    // stationId or tmsId
    source: String,    // gracenote or ...
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
        personIds: [String]}, 
    active: Boolean,
    dataId: {type: Schema.Types.ObjectId, ref: 'ImageData'}
    }, {collection: 'Images'});

mongoose.model('Image', Image);