'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BillingPayment = new Schema({
    username: String,
    amount: Number,
    paymentTime: Date,
    currency: String,
    submitTime: Date,
    clientId: String,
    status: String,
    reason: String,
    processTime: Date,
    payload: Object
}, {collection: 'BillingPayments'});

mongoose.model('BillingPayment', BillingPayment);
