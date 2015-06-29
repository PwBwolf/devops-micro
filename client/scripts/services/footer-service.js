(function (app) {
    'use strict';

    app.factory('footerSvc', [function () {
        var sports_Ctgry = [
            {channelName: 'beIN Sports', channelCtgry: '1', showTitle: 'SHOWS_SPORTS_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_SP_1', showDescriptionContent: 'SHOWS_SPORTS_PNL_1_DESC_CNTNT'},
            {channelName: 'beIN Sports ñ', channelCtgry: '2', showTitle: 'SHOWS_SPORTS_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_SP_2', showDescriptionContent: 'SHOWS_SPORTS_PNL_2_DESC_CNTNT'},
            {channelName: 'TyC Sports', channelCtgry: '3', showTitle: 'SHOWS_SPORTS_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_SP_3', showDescriptionContent: 'SHOWS_SPORTS_PNL_3_DESC_CNTNT'},
            {channelName: 'PXTV Action LATAM', channelCtgry: '4', showTitle: 'SHOWS_SPORTS_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_SP_4', showDescriptionContent: 'SHOWS_SPORTS_PNL_4_DESC_CNTNT'},
            {channelName: 'AYM Sports', channelCtgry: '5', showTitle: 'SHOWS_SPORTS_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_SP_5', showDescriptionContent: 'SHOWS_SPORTS_PNL_5_DESC_CNTNT'}
        ];

        var kids_Ctgry = [
            {channelName: 'Smile of a Child', channelCtgry: '1', showTitle: 'SHOWS_NEWS_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_KDS_1', showDescriptionContent: 'SHOWS_NEWS_PNL_1_DESC_CNTNT'},
            {channelName: 'images/channels-big/hola-tv.jpg', channelCtgry: '2', showTitle: 'SHOWS_NEWS_PNL_2_TITLE', showDescription: 'SHOWS_NEWS_PNL_2_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_2_DESC_CNTNT'},
            {channelName: 'images/channels-big/ntn-24.png', channelCtgry: '3', showTitle: 'SHOWS_NEWS_PNL_3_TITLE', showDescription: 'SHOWS_NEWS_PNL_3_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_3_DESC_CNTNT'},
            {channelName: 'images/channels-big/ntn-24.png', channelCtgry: '4', showTitle: 'SHOWS_NEWS_PNL_4_TITLE', showDescription: 'SHOWS_NEWS_PNL_4_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_4_DESC_CNTNT'},
            {channelName: 'images/channels-big/tele-sur.png', channelCtgry: '5', showTitle: 'SHOWS_NEWS_PNL_5_TITLE', showDescription: 'SHOWS_NEWS_PNL_5_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_5_DESC_CNTNT'},
            {channelName: 'images/channels-big/antena-3.png', channelCtgry: '6', showTitle: 'SHOWS_NEWS_PNL_6_TITLE', showDescription: 'SHOWS_NEWS_PNL_6_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_6_DESC_CNTNT'}
        ];

        var general_Ctgry = [
            {channelName: 'Bolivia TV', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_GNRL_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'Canal América', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_GNRL_2', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelName: 'Promovision', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_GNRL_3', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
            {channelName: 'TV Chile', channelCtgry: '4', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_GNRL_4', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelName: 'CBTV', channelCtgry: '5', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_GNRL_5', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'}
        ];
		
        var news_Ctgry = [
            {channelName: 'Canal Tiempo', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'CB24', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_2', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelName: 'Maya TV', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_3', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
            {channelName: 'MeioNorte', channelCtgry: '4', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_4', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelName: 'NTN24', channelCtgry: '5', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_5', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'},
            {channelName: 'One America News', channelCtgry: '6', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_6', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'RT Español', channelCtgry: '7', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_7', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'RT News', channelCtgry: '8', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_8', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Telesur', channelCtgry: '9', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_NEWS_9', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'}
	    ];
		
        var music_Ctgry = [
            {channelName: 'AZ Clic', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'Clubbing TV', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_2', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelName: 'El Cantinazo', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_3', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
			{channelName: 'JCTV', channelCtgry: '4', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_4', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Mi Gente TV', channelCtgry: '5', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_5', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelName: 'Mi Musica', channelCtgry: '6', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_6', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'},
            {channelName: 'Video Rola', channelCtgry: '7', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_MSC_7', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'}
        ];
		
        var edu_Ctgry = [
			{channelName: 'HITN', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_EDU_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'Yes', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_EDU_2', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'Zoom', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_EDU_3', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'}

        ];
		
        var lifestyle_Ctgry = [
            {channelName: 'Destinos TV', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_LS_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'Trendy', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_LS_2', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
        ];
		
        var faith_Ctgry = [
            {channelName: 'Enlace Juvenil', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'FOOTER_CHANNEL_FTH_1', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelName: 'TBN', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_FTH_2', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelName: 'TBN Enlance', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_FTH_3', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
            {channelName: 'Tele Vid', channelCtgry: '4', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_FTH_4', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelName: 'The Church Channel', channelCtgry: '5', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_FTH_5', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'}
        ];
		
        var ent_Ctgry = [
            {channelName: 'Hola! TV', channelCtgry: '1', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_1', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelName: 'RCN Novelas', channelCtgry: '2', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_2', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
            {channelName: 'Caribvision', channelCtgry: '3', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_3', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelName: 'Latele Novela', channelCtgry: '4', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_4', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'},
			{channelName: 'Canal 52 MX', channelCtgry: '5', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_5', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'},
            {channelName: 'TVC Latino', channelCtgry: '6', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_6', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'TV Quisqueya', channelCtgry: '7', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_7', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Tempo', channelCtgry: '8', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_8', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'A 3 Series', channelCtgry: '9', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_9', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Teleformula', channelCtgry: '10', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_10', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Tele Pacífico', channelCtgry: '11', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_11', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Tele Medellin', channelCtgry: '12', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_12', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Tele Caribe', channelCtgry: '13', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_13', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Tele Antioquia', channelCtgry: '14', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_14', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'JBN', channelCtgry: '15', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_15', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'HITN', channelCtgry: '16', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_16', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Cosmovisión', channelCtgry: '17', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_17', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Canal Tro', channelCtgry: '18', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_18', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Canal Sur', channelCtgry: '19', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_19', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Canal Antiestres', channelCtgry: '20', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_20', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Antenna3', channelCtgry: '21', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_21', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'AZ Corazón', channelCtgry: '22', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_22', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'},
			{channelName: 'Telemicro Internacional', channelCtgry: '23', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'FOOTER_CHANNEL_ENT_23', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'}
        	
		
		];


        return {
            getSports: function () {
                return sports_Ctgry;
            },

            getKids: function () {
                return kids_Ctgry;
            },

            getGeneral: function () {
                return general_Ctgry;
            },

            getNews: function () {
                return news_Ctgry;
            },
			
			getMusic: function () {
				return music_Ctgry;
			},
			
			getEdu: function () {
				return edu_Ctgry;
			},
			
			getLifestyle: function () {
				return lifestyle_Ctgry;
			},
			
			getFaith: function () {
				return faith_Ctgry;
			},
			
			getEnt: function () {
				return ent_Ctgry;
			}
        };
    }]);
}(angular.module('app')));
