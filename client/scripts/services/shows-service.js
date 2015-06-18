(function (app) {
    'use strict';

    app.factory('showsSvc', [function () {
        var shows1 = [
            {channelId: 'images/channels-big/bein-sports-espanol.png', showBanner: 'images/shows/sports/copa.jpg', showTitle: 'SHOWS_SPORTS_PNL_1_TITLE', showDescription: 'SHOWS_SPORTS_PNL_1_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_1_DESC_CNTNT'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/boxeo.jpg', showTitle: 'SHOWS_SPORTS_PNL_2_TITLE', showDescription: 'SHOWS_SPORTS_PNL_2_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_2_DESC_CNTNT'},
            {channelId: 'images/channels-big/bein-sports.png', showBanner: 'images/shows/sports/score.jpg', showTitle: 'SHOWS_SPORTS_PNL_3_TITLE', showDescription: 'SHOWS_SPORTS_PNL_3_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_3_DESC_CNTNT'},
            {channelId: 'images/channels-big/bein-sports.png', showBanner: 'images/shows/sports/superbike.jpg', showTitle: 'SHOWS_SPORTS_PNL_4_TITLE', showDescription: 'SHOWS_SPORTS_PNL_4_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_4_DESC_CNTNT'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/auto.jpg', showTitle: 'SHOWS_SPORTS_PNL_5_TITLE', showDescription: 'SHOWS_SPORTS_PNL_5_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_5_DESC_CNTNT'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/locas.jpg', showTitle: 'SHOWS_SPORTS_PNL_6_TITLE', showDescription: 'SHOWS_SPORTS_PNL_6_DESC', showDescriptionContent: 'SHOWS_SPORTS_PNL_6_DESC_CNTNT'}
        ];

        var shows2 = [
            {channelId: 'images/channels-big/tele-antiquioa.png', showBanner: 'images/shows/news/formular.jpg', showTitle: 'SHOWS_NEWS_PNL_1_TITLE', showDescription: 'SHOWS_NEWS_PNL_1_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_1_DESC_CNTNT'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/latarde.jpg', showTitle: 'SHOWS_NEWS_PNL_2_TITLE', showDescription: 'SHOWS_NEWS_PNL_2_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_2_DESC_CNTNT'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/planeta.jpg', showTitle: 'SHOWS_NEWS_PNL_3_TITLE', showDescription: 'SHOWS_NEWS_PNL_3_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_3_DESC_CNTNT'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/noticias.jpg', showTitle: 'SHOWS_NEWS_PNL_4_TITLE', showDescription: 'SHOWS_NEWS_PNL_4_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_4_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/news/lamanana.jpg', showTitle: 'SHOWS_NEWS_PNL_5_TITLE', showDescription: 'SHOWS_NEWS_PNL_5_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_5_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/news/espejo.jpg', showTitle: 'SHOWS_NEWS_PNL_6_TITLE', showDescription: 'SHOWS_NEWS_PNL_6_DESC', showDescriptionContent: 'SHOWS_NEWS_PNL_6_DESC_CNTNT'}
        ];

        var shows3 = [
            {channelId: 'images/channels-big/jbn.png', showBanner: 'images/shows/entertainment/seinfeld.jpg', showTitle: 'SHOWS_ENT_PNL_1_TITLE', showDescription: 'SHOWS_ENT_PNL_1_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_1_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/tucara.jpg', showTitle: 'SHOWS_ENT_PNL_2_TITLE', showDescription: 'SHOWS_ENT_PNL_2_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_2_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/secreto.jpg', showTitle: 'SHOWS_ENT_PNL_3_TITLE', showDescription: 'SHOWS_ENT_PNL_3_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_3_DESC_CNTNT'},
            {channelId: 'images/channels-big/video-rola.png', showBanner: 'images/shows/entertainment/musica.jpg', showTitle: 'SHOWS_ENT_PNL_4_TITLE', showDescription: 'SHOWS_ENT_PNL_4_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_4_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/septimo.jpg', showTitle: 'SHOWS_ENT_PNL_5_TITLE', showDescription: 'SHOWS_ENT_PNL_5_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_5_DESC_CNTNT'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/costuras.jpg', showTitle: 'SHOWS_ENT_PNL_6_TITLE', showDescription: 'SHOWS_ENT_PNL_6_DESC', showDescriptionContent: 'SHOWS_ENT_PNL_6_DESC_CNTNT'}
        ];

        var showClasses = [
            {className: 'panel-closed'},
            {className: 'panel-open'},
            {className: 'panel'},
            {className: 'panel-default'},
            {className: 'col-md-2'},
            {className: 'front'},
            {className: 'back'}
        ];

        return {
            getShows1: function () {
                return shows1;
            },

            getShows2: function () {
                return shows2;
            },

            getShows3: function () {
                return shows3;
            },

            getShowClasses: function () {
                return showClasses;
            }
        };
    }]);
}(angular.module('app')));
