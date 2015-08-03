'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');
var Schema = mongoose.Schema;

var Program = new Schema({
    startTime: String,
    endTime: String,
    duration: Number,
	ratings: {
		body: String,
		code: String
	},
	qualifiers: [String],
    channels: [String],
    stationId: String,
    program: {
        tmsId: String,
        rootId: String,
        seriesId: String,
        subType: String,
        title: String,
		titleLang: String,
		shortDescription: String,
        descriptionLang: String,
		genres: [String],
		eventTitle: String,
		organizationId: String,
		sportsId: String,
		origAirDate: Date,
		seasonNum: Number,
		episodeNum: Number,
		episodeTitle: String,
        releaseYear: Date,
        releaseDate: Date,
        entityType: String,
        preferredImage: {
            uri: String,
			Height: String,
			width: String,
			size: String,
			aspect: String,
			text: String,
			primary: Boolean,
			category: String,
			tier: String,
			caption: {
				content: String,
				lang: String
			},
			personIds: [String]
        },
		longDescription: String,
		topCast: [String],
		directors: [String],
		qualityRating: {
			ratingsBody: String,
			value: String
		},
		gameDate: Date,
		teams:[{
			teamBrandId: String,
			name: String,
			isHome: Boolean
		}],
		season: String
    }
}, {collection: 'Programs'});

mongoose.model('Program', Program);