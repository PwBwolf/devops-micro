'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CmsCategory = new Schema({
    name: String,
    tags: [String]
}, {collection: 'CmsCategories'});

mongoose.model('CmsCategory', CmsCategory);
