'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewUser = new Schema({
    merchant: {type: Schema.Types.ObjectId, ref: 'Merchant'},
    merchantPopId: String,
    merchantReferenceId: String,
    submitTime: Date,
    processTime: Date,
    username: String,
    status: String,
    reason: String,
    payload: String
}, { collection: 'Users' });

mongoose.model('NewUser', NewUser);
