'use strict';

var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var Rule = new Schema({
    name: String,
    description: String,
    priority: Number,
    condition: Function,
    consequence: Function
});

mongoose.model('Rule', Rule);
