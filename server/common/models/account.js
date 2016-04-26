'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../common/setup/config');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.db);

autoIncrement.initialize(connection);

var Account = new Schema({
    primaryUser: {type: Schema.Types.ObjectId, ref: 'User'},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    createdAt: {type: Date, required: true, index: true},
    type: {type: String, required: true, index: true},
    referredBy: String,
    key: Schema.Types.Mixed,
    freeSideCustomerNumber: Number,
    complimentaryCode: {type: String, sparse: true},
    merchant: {type: String, index: true},
    firstCardPaymentDate: Date,
    firstMerchantPaymentDate: Date,
    billingDate: Date,
    startDate: {type: Date, index: true},
    premiumEndDate: Date,
    packages: {type:[String], index: true}
}, {collection: 'Accounts'});

mongoose.model('Account', Account);
