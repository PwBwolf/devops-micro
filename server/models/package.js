'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Package = new Schema({
    name: String,
    channel: {},
    price: Number,
    currency: String,
    durationType: String,
    durationValue: Number,
    disabled: Boolean
}, { collection: 'Packages' });

mongoose.model('Package', Package);



