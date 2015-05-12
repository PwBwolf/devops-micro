'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MakePayment = new Schema({
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
    isUserOwned: Boolean,
    payload: String
}, { collection: 'Payments' });

mongoose.model('MakePayment', MakePayment);
