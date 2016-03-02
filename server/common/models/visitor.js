'use strict';

// delete model after release

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visitor = new Schema({
    firstName: {type: String, required: false, trim: true},
    lastName: {type: String, required: false, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    createdAt: {type: Date, required: true},
    updatedAt: Date
}, {collection: 'Visitors'});

mongoose.model('Visitor', Visitor);
