'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var State = new Schema({
    name: {type: String, required: true },
    code: {type: String, required: true }
}, { collection: 'States' });

mongoose.model('State', State);
