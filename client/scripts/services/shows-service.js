(function (app) {
    'use strict';

    app.factory('showsSvc', [function () {
        var shows1 = [
            {channelId: 'images/channels-big/bein-sports-espanol.png', showBanner: 'images/shows/sports/liga.jpg', showTitle: 'Spanish Primera Division Soccer', showDescription: 'beIN Sports | es,en', showDescriptionContent: 'From Santiago Bernabeu Stadium in Madrid, Spain.'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/boxeo.jpg', showTitle: 'Boxeo', showDescription: 'TYC Sports', showDescriptionContent: 'Mas de 60 veladas nacionales e internacionales poer ano. '},
            {channelId: 'images/channels-big/bein-sports.png', showBanner: 'images/shows/sports/copa.jpg', showTitle: 'Copa America Chile', showDescription: 'beIN Sports', showDescriptionContent: 'Watch Live on beIN Sports.'},
            {channelId: 'images/channels-big/bein-sports.png', showBanner: 'images/shows/sports/superbike.jpg', showTitle: 'Super Bike', showDescription: 'beIN Sports', showDescriptionContent: 'Watch live on beIN Sports.'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/auto.jpg', showTitle: 'Autimovilismo', showDescription: 'TYC Sports', showDescriptionContent: 'TC 2000, Super TC 200 y Top Race v-6'},
            {channelId: 'images/channels-big/tvc-latino.png', showBanner: 'images/shows/sports/futbol.jpg', showTitle: 'Futbol Argentino - Primera Division', showDescription: 'TYC Sports', showDescriptionContent: '9 partidos exclusivos por fin de semana'}
        ];

        var shows2 = [
            {channelId: 'images/channels-big/tele-antiquioa.png', showBanner: 'images/shows/news/formular.jpg', showTitle: 'tele Fórmula', showDescription: 'teleFórmula', showDescriptionContent: 'Entérate en directo toda la actualidad de México y el mundo por teleFórmula.'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/latarde.jpg', showTitle: 'La Tarde', showDescription: 'NTN24', showDescriptionContent: 'El Análisis, investigación y la actualidad agenda informativa'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/planeta.jpg', showTitle: 'Planeta Gente', showDescription: 'NTN24', showDescriptionContent: 'Las Noticias Del Mundo Del Entretenimiento'},
            {channelId: 'images/channels-big/ntn-24.png', showBanner: 'images/shows/news/noticias.jpg', showTitle: 'NTN24 Nuestra Tele Noticias', showDescription: 'NTN24', showDescriptionContent: 'De Latino para latino.'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/news/lamanana.jpg', showTitle: 'Noticias De La Mañana', showDescription: 'Antena 3', showDescriptionContent: ''},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/news/espejo.jpg', showTitle: 'Espejo Publico Prsentadores', showDescription: 'Antena 3', showDescriptionContent: ''}
        ];

        var shows3 = [
            {channelId: 'images/channels-big/jbn.png', showBanner: 'images/shows/entertainment/seinfeld.jpg', showTitle: 'Seinfeld', showDescription: 'JBN', showDescriptionContent: 'Amigos que viven en Manhatten se obsessionan de las cosas pequeñas. '},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/tucara.jpg', showTitle: 'Tu Cara Me Suena España', showDescription: 'COMING SOON', showDescriptionContent: ''},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/secreto.jpg', showTitle: 'El Secreto', showDescription: 'COMING SOON', showDescriptionContent: ''},
            {channelId: 'images/channels-big/video-rola.png', showBanner: 'images/shows/entertainment/musica.jpg', showTitle: 'The Regional Mexican Music Channel', showDescription: 'Video Rola', showDescriptionContent: 'Conciertos, especiales, videos, exclusivos!'},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/septimo.jpg', showTitle: 'La Ruleta Séptimo Aniversario', showDescription: 'COMING SOON', showDescriptionContent: ''},
            {channelId: 'images/channels-big/antena-3.png', showBanner: 'images/shows/entertainment/costuras.jpg', showTitle: 'El Tiempo Entre Costuras', showDescription: 'COMING SOON', showDescriptionContent: ''}
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
