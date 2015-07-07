(function (app) {
    'use strict';

    app.factory('showsSvc', [function () {
        var sports = [
            {channel: 'images/channels-big/bein-sports-espanol.png', banner: 'images/shows/sports/copa.jpg', title: 'SHOWS_SPORTS_1_TITLE', description: 'SHOWS_SPORTS_1_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_1_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/tvc-latino.png', banner: 'images/shows/sports/boxeo.jpg', title: 'SHOWS_SPORTS_2_TITLE', description: 'SHOWS_SPORTS_2_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_2_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/canal-52.jpg', banner: 'images/shows/sports/score.jpg', title: 'SHOWS_SPORTS_3_TITLE', description: 'SHOWS_SPORTS_3_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_3_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/bein-sports.png', banner: 'images/shows/sports/superbike.jpg', title: 'SHOWS_SPORTS_4_TITLE', description: 'SHOWS_SPORTS_4_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_4_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/tvc-latino.png', banner: 'images/shows/sports/auto.jpg', title: 'SHOWS_SPORTS_5_TITLE', description: 'SHOWS_SPORTS_5_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_5_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/canal-52.jpg', banner: 'images/shows/sports/locas.jpg', title: 'SHOWS_SPORTS_6_TITLE', description: 'SHOWS_SPORTS_6_DESCRIPTION', channelDescription: 'SHOWS_SPORTS_6_CHANNEL_DESCRIPTION'}
        ];

        var news = [
            {channel: 'images/channels-big/tele-antiquioa.png', banner: 'images/shows/news/formular.jpg', title: 'SHOWS_NEWS_1_TITLE', description: 'SHOWS_NEWS_1_DESCRIPTION', channelDescription: 'SHOWS_NEWS_1_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/hola-tv.jpg', banner: 'images/shows/news/conexion.jpg', title: 'SHOWS_NEWS_2_TITLE', description: 'SHOWS_NEWS_2_DESCRIPTION', channelDescription: 'SHOWS_NEWS_2_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/ntn-24.png', banner: 'images/shows/news/titulares.jpg', title: 'SHOWS_NEWS_3_TITLE', description: 'SHOWS_NEWS_3_DESCRIPTION', channelDescription: 'SHOWS_NEWS_3_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/ntn-24.png', banner: 'images/shows/news/noticias.jpg', title: 'SHOWS_NEWS_4_TITLE', description: 'SHOWS_NEWS_4_DESCRIPTION', channelDescription: 'SHOWS_NEWS_4_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/tele-sur.png', banner: 'images/shows/news/impacto.png', title: 'SHOWS_NEWS_5_TITLE', description: 'SHOWS_NEWS_5_DESCRIPTION', channelDescription: 'SHOWS_NEWS_5_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/antena-3.png', banner: 'images/shows/news/espejo.jpg', title: 'SHOWS_NEWS_6_TITLE', description: 'SHOWS_NEWS_6_DESCRIPTION', channelDescription: 'SHOWS_NEWS_6_CHANNEL_DESCRIPTION'}
        ];

        var entertainment = [
            {channel: 'images/channels-big/jbn.png', banner: 'images/shows/entertainment/seinfeld.jpg', title: 'SHOWS_ENTERTAINMENT_1_TITLE', description: 'SHOWS_ENTERTAINMENT_1_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_1_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/antena-3.png', banner: 'images/shows/entertainment/hormiguero.jpg', title: 'SHOWS_ENTERTAINMENT_2_TITLE', description: 'SHOWS_ENTERTAINMENT_2_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_2_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/hola-tv.jpg', banner: 'images/shows/entertainment/iconos.jpg', title: 'SHOWS_ENTERTAINMENT_3_TITLE', description: 'SHOWS_ENTERTAINMENT_3_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_3_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/video-rola.png', banner: 'images/shows/entertainment/musica.jpg', title: 'SHOWS_ENTERTAINMENT_4_TITLE', description: 'SHOWS_ENTERTAINMENT_4_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_4_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/antena-3.png', banner: 'images/shows/entertainment/simpsons.jpg', title: 'SHOWS_ENTERTAINMENT_5_TITLE', description: 'SHOWS_ENTERTAINMENT_5_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_5_CHANNEL_DESCRIPTION'},
            {channel: 'images/channels-big/antena-3.png', banner: 'images/shows/entertainment/costuras.jpg', title: 'SHOWS_ENTERTAINMENT_6_TITLE', description: 'SHOWS_ENTERTAINMENT_6_DESCRIPTION', channelDescription: 'SHOWS_ENTERTAINMENT_6_CHANNEL_DESCRIPTION'}
        ];

        return {
            getSports: function () {
                return sports;
            },

            getNews: function () {
                return news;
            },

            getEntertainment: function () {
                return entertainment;
            }
        };
    }]);
}(angular.module('app')));
