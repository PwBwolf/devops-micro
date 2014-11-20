'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Offer = new Schema({
    name: String
});

mongoose.model('Offer', Offer);



