'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');

var Schema = mongoose.Schema;

var Event = new Schema({
    source: String,
    fileName: String,
    type: String,
    airings: 
        [{
            attributeType: String,
            title: String,
            startTime: Date,
            eit: Boolean,
            eitName: String,
            eitShort: String,
            eitLong: String,
            eitStop: Boolean,
            pGuidance: Number,
            mediaId: String,
            duration: String,
            category: String,
            dvbEventClass: String,
            aspectRatio: String,
            thirdPartyId: String,
            playerGroupId: Number,
            offset: String,
            wssEnable: Boolean
        }]
    }, {collection: 'Events'});

mongoose.model('Event', Event);