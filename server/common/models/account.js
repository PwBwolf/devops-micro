'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    primaryUser: {type: Schema.Types.ObjectId, ref: 'User'},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    createdAt: {type: Date, required: true},
    type: {type: String, required: true},
    referredBy: String,
    aioAccountId: Number,
    freeSideCustomerNumber: Number
}, {collection: 'Accounts'});

mongoose.model('Account', Account);
