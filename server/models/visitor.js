'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visitor = new Schema({
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type: String, required: true}
}, { collection: 'Visitors' });

mongoose.model('Visitor', Visitor);
