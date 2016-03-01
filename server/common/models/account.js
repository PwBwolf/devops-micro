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
    createdAt: {type: Date, required: true},
    type: {type: String, required: true},
    referredBy: String,
    key: Number,
    freeSideCustomerNumber: Number,
    complimentaryCode: {type: String, sparse: true},
    merchant: String,
    firstCardPaymentDate: Date,
    firstMerchantPaymentDate: Date,
    aioAccountId: Number, // remove post release
    billingDate: Date,
    startDate: Date,
    premiumEndDate: Date,
    packages: [String]
}, {collection: 'Accounts'});

Account.plugin(autoIncrement.plugin, {model: 'Account', field: 'key', startAt: 1000});
mongoose.model('Account', Account);
