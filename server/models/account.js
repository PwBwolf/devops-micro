'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    primaryUser: {type: Schema.Types.ObjectId, ref: 'User'},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    disabled: Boolean,
    deleted: Boolean,
    createdAt: Date,
    referralCode: String,
    primaryCard: {
        _id: ObjectId,
        type: String,
        name: String,
        last4Digits: String,
        paymentGatewayKey: String
    },
    cardHistory: [
        {
            _id: ObjectId,
            type: String,
            name: String,
            last4Digits: String,
            paymentGatewayKey: String
        }
    ],
    activePackages: [
        {
            package: {type: Schema.Types.ObjectId, ref: 'Package'},
            startDate: Date,
            endDate: Date,
            inActive: Boolean,
            inactiveReason: String,
            autoRenew: Boolean,
            offer: {}
        }
    ],
    packageHistory: [
        {
            package: {type: Schema.Types.ObjectId, ref: 'Package'},
            startDate: Date,
            endDate: Date,
            autoRenew: Boolean,
            offer: {}
        }
    ]
});

mongoose.model('Account', Account);



