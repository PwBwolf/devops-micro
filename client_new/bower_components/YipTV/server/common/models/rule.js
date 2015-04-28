'use strict';

var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var Rule = new Schema({
    name: String,
    description: String,
    priority: Number,
    enabled: Boolean,
    condition: Function,
    consequence: Function
}, {collection: 'Rules'});

mongoose.model('Rule', Rule);
