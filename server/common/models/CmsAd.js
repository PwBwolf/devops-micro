'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CmsAd = new Schema({
    name: String
}, {collection: 'CmsAds'});

mongoose.model('CmsAd', CmsAd);
