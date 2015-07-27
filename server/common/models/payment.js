'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Payment = new Schema({
    merchant: {type: Schema.Types.ObjectId, ref: 'Merchant', index: true},
    merchantPopId: String,
    merchantReferenceId: String,
    submitTime: Date,
    processTime: Date,
    username: {type: String, index: true},
    status: String,
    reason: String,
    amount: Number,
    currency: String,
    payload: Object
}, {collection: 'Payments'});

mongoose.model('Payment', Payment);
