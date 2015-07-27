'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Country = new Schema({
    name: {type: String, required: true},
    code: {type: String, required: true}
}, {collection: 'Countries'});

mongoose.model('Country', Country);
