'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../../common/setup/config'),
    autoIncrement = require('mongoose-auto-increment'),
    connection = mongoose.createConnection(config.db);

autoIncrement.initialize(connection);

var Referrer = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    key: {type: Number, required: true},
    referralCode: {type: String, unique: true},
    createdAt: {type: Date, required: true}
}, {collection: 'Referrers'});

Referrer.plugin(autoIncrement.plugin, {model: 'Referrer', field: 'key', startAt: 100});
connection.model('Referrer', Referrer);
