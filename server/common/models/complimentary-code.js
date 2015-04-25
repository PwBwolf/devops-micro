'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComplimentaryCode = new Schema({
    requestedBy: {type: String, required: true, trim: true},
    department: {type: String, required: true, trim: true},
    reason: {type: String, required: true, trim: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    createdAt: {type: Date, required: true},
    updatedAt: Date,
    disabled: Boolean,
    code: {type: String, sparse: true},
    duration: {type: Number, required: true},
    maximumAccounts: {type: Number, required: true},
    accountCount: {type: Number, required: true}

}, {collection: 'ComplimentaryCodes'});

mongoose.model('ComplimentaryCode', ComplimentaryCode);
