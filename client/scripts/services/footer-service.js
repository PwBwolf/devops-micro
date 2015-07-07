(function (app) {
    'use strict';

    app.factory('footerSvc', [function () {
        var sportsCategory = [
            {channelName: 'beIN Sports', showUrl: 'FOOTER_CHANNEL_SPORTS_1'},
            {channelName: 'beIN Sports ñ', showUrl: 'FOOTER_CHANNEL_SPORTS_2'},
            {channelName: 'TyC Sports', showUrl: 'FOOTER_CHANNEL_SPORTS_3'},
            {channelName: 'PXTV Action LATAM', showUrl: 'FOOTER_CHANNEL_SPORTS_4'},
            {channelName: 'AYM Sports', showUrl: 'FOOTER_CHANNEL_SPORTS_5'}
        ];

        var kidsCategory = [
            {channelName: 'Smile of a Child', showUrl: 'FOOTER_CHANNEL_KIDS_1'}
        ];

        var generalCategory = [
            {channelName: 'Bolivia TV', showUrl: 'FOOTER_CHANNEL_GENERAL_1'},
            {channelName: 'Canal América', showUrl: 'FOOTER_CHANNEL_GENERAL_2'},
            {channelName: 'Promovision', showUrl: 'FOOTER_CHANNEL_GENERAL_3'},
            {channelName: 'TV Chile', showUrl: 'FOOTER_CHANNEL_GENERAL_4'},
            {channelName: 'CBTV', showUrl: 'FOOTER_CHANNEL_GENERAL_5'}
        ];

        var newsCategory = [
            {channelName: 'Canal Tiempo', showUrl: 'FOOTER_CHANNEL_NEWS_1'},
            {channelName: 'CB24', showUrl: 'FOOTER_CHANNEL_NEWS_2'},
            {channelName: 'Maya TV', showUrl: 'FOOTER_CHANNEL_NEWS_3'},
            {channelName: 'MeioNorte', showUrl: 'FOOTER_CHANNEL_NEWS_4'},
            {channelName: 'NTN24', showUrl: 'FOOTER_CHANNEL_NEWS_5'},
            {channelName: 'One America News', showUrl: 'FOOTER_CHANNEL_NEWS_6'},
            {channelName: 'RT Español', showUrl: 'FOOTER_CHANNEL_NEWS_7'},
            {channelName: 'RT News', showUrl: 'FOOTER_CHANNEL_NEWS_8'},
            {channelName: 'Telesur', showUrl: 'FOOTER_CHANNEL_NEWS_9'}
        ];

        var musicCategory = [
            {channelName: 'AZ Clic', showUrl: 'FOOTER_CHANNEL_MUSIC_1'},
            {channelName: 'Clubbing TV', showUrl: 'FOOTER_CHANNEL_MUSIC_2'},
            {channelName: 'El Cantinazo', showUrl: 'FOOTER_CHANNEL_MUSIC_3'},
            {channelName: 'JCTV', showUrl: 'FOOTER_CHANNEL_MUSIC_4'},
            {channelName: 'Mi Gente TV', showUrl: 'FOOTER_CHANNEL_MUSIC_5'},
            {channelName: 'Mi Musica', showUrl: 'FOOTER_CHANNEL_MUSIC_6'},
            {channelName: 'Video Rola', showUrl: 'FOOTER_CHANNEL_MUSIC_7'}
        ];

        var educationCategory = [
            {channelName: 'HITN', showUrl: 'FOOTER_CHANNEL_EDUCATION_1'},
            {channelName: 'Yes', showUrl: 'FOOTER_CHANNEL_EDUCATION_2'},
            {channelName: 'Zoom', showUrl: 'FOOTER_CHANNEL_EDUCATION_3'}

        ];

        var lifestyleCategory = [
            {channelName: 'Destinos TV', showUrl: 'FOOTER_CHANNEL_LIFESTYLE_1'},
            {channelName: 'Trendy', showUrl: 'FOOTER_CHANNEL_LIFESTYLE_2'}
        ];

        var faithCategory = [
            {channelName: 'Enlace Juvenil', showUrl: 'FOOTER_CHANNEL_FAITH_1'},
            {channelName: 'TBN', showUrl: 'FOOTER_CHANNEL_FAITH_2'},
            {channelName: 'TBN Enlance', showUrl: 'FOOTER_CHANNEL_FAITH_3'},
            {channelName: 'Tele Vid', showUrl: 'FOOTER_CHANNEL_FAITH_4'},
            {channelName: 'The Church Channel', showUrl: 'FOOTER_CHANNEL_FAITH_5'}
        ];

        var entertainmentCategory = [
            {channelName: 'Hola! TV', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_1'},
            {channelName: 'RCN Novelas', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_2'},
            {channelName: 'Caribvision', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_3'},
            {channelName: 'Latele Novela', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_4'},
            {channelName: 'Canal 52 MX', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_5'},
            {channelName: 'TVC Latino', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_6'},
            {channelName: 'TV Quisqueya', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_7'},
            {channelName: 'Tempo', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_8'},
            {channelName: 'A 3 Series', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_9'},
            {channelName: 'Teleformula', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_10'},
            {channelName: 'Tele Pacífico', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_11'},
            {channelName: 'Tele Medellin', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_12'},
            {channelName: 'Tele Caribe', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_13'},
            {channelName: 'Tele Antioquia', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_14'},
            {channelName: 'JBN', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_15'},
            {channelName: 'HITN', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_16'},
            {channelName: 'Cosmovisión', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_17'},
            {channelName: 'Canal Tro', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_18'},
            {channelName: 'Canal Sur', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_19'},
            {channelName: 'Canal Antiestres', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_20'},
            {channelName: 'Antenna3', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_21'},
            {channelName: 'AZ Corazón', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_22'},
            {channelName: 'Telemicro Internacional', showUrl: 'FOOTER_CHANNEL_ENTERTAINMENT_23'}
        ];


        return {
            getSports: function () {
                return sportsCategory;
            },

            getKids: function () {
                return kidsCategory;
            },

            getGeneral: function () {
                return generalCategory;
            },

            getNews: function () {
                return newsCategory;
            },

            getMusic: function () {
                return musicCategory;
            },

            getEducation: function () {
                return educationCategory;
            },

            getLifestyle: function () {
                return lifestyleCategory;
            },

            getFaith: function () {
                return faithCategory;
            },

            getEntertainment: function () {
                return entertainmentCategory;
            }
        };
    }]);
}(angular.module('app')));
