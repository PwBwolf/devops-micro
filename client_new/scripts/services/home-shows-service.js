(function (app) {
    'use strict';

    app.factory('homeShowsSvc', [function () {
        var usrShws = [
            {chnlID: 'img/BigLogos/live-channels-big-_0032_beIN-n.png', shwBnr: 'img/shws/sports/liga.jpg', shwTitle: 'Spanish Primera Division Soccer', shwDesc: 'beIN Sports | es,en', shwDescCntnt: 'From Santiago Bernabeu Stadium in Madrid, Spain.'},
            {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/boxeo.jpg', shwTitle: 'Boxeo', shwDesc: 'TYC Sports', shwDescCntnt: 'Mas de 60 veladas nacionales e internacionales poer ano. '},
            {chnlID: 'img/BigLogos/live-channels-big-_0033_beIN-Sports.png', shwBnr: 'img/shws/sports/copa.jpg', shwTitle: 'Copa America Chile', shwDesc: 'beIN Sports', shwDescCntnt: 'Watch Live on beIN Sports.'},
            {chnlID: 'img/BigLogos/live-channels-big-_0033_beIN-Sports.png', shwBnr: 'img/shws/sports/superbike.jpg', shwTitle: 'Super Bike', shwDesc: 'beIN Sports', shwDescCntnt: 'Watch live on beIN Sports.'},
            {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/auto.jpg', shwTitle: 'Autimovilismo', shwDesc: 'TYC Sports', shwDescCntnt: 'TC 2000, Super TC 200 y Top Race v-6'},
            {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/futbol.jpg', shwTitle: 'Futbol Argentino - Primera Division', shwDesc: 'TYC Sports', shwDescCntnt: '9 partidos exclusivos por fin de semana'}
        ];

        var usrShws1 = [
            {chnlID: 'img/BigLogos/live-channels-big-_0020_JBN.png', shwBnr: 'img/shws/ent/seinfeld.jpg', shwTitle: 'Seinfeld', shwDesc: 'JBN', shwDescCntnt: 'Amigos que viven en Manhatten se obsessionan de las cosas pequeñas. '},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/tucara.jpg', shwTitle: 'Tu Cara Me Suena España', shwDesc: 'COMING SOON', shwDescCntnt: ''},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/secreto.jpg', shwTitle: 'El Secreto', shwDesc: 'COMING SOON', shwDescCntnt: ''},
            {chnlID: 'img/BigLogos/live-channels-big-_0004_Layer-1.png', shwBnr: 'img/shws/ent/musica.jpg', shwTitle: 'The Regional Mexican Music Channel', shwDesc: 'Video Rola', shwDescCntnt: 'Conciertos, especiales, videos, exclusivos!'},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/septimo.jpg', shwTitle: 'La Ruleta Séptimo Aniversario', shwDesc: 'COMING SOON', shwDescCntnt: ''},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/costuras.jpg', shwTitle: 'El Tiempo Entre Costuras', shwDesc: 'COMING SOON', shwDescCntnt: ''}
        ];

        var usrShws2 = [
            {chnlID: 'img/BigLogos/live-channels-big-_0013_teleantiquioa.png', shwBnr: 'img/shws/news/formular.jpg', shwTitle: 'tele Fórmula', shwDesc: 'teleFórmula', shwDescCntnt: 'Entérate en directo toda la actualidad de México y el mundo por teleFórmula.'},
            {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/latarde.jpg', shwTitle: 'La Tarde', shwDesc: 'NTN24', shwDescCntnt: 'El Análisis, investigación y la actualidad agenda informativa'},
            {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/planeta.jpg', shwTitle: 'Planeta Gente', shwDesc: 'NTN24', shwDescCntnt: 'Las Noticias Del Mundo Del Entretenimiento'},
            {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/noticias.jpg', shwTitle: 'NTN24 Nuestra Tele Noticias', shwDesc: 'NTN24', shwDescCntnt: 'De Latino para latino.'},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/news/lamanana.jpg', shwTitle: 'Noticias De La Mañana', shwDesc: 'Antena 3', shwDescCntnt: ''},
            {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/news/espejo.jpg', shwTitle: 'Espejo Publico Prsentadores', shwDesc: 'Antena 3', shwDescCntnt: ''}
        ];

        var usrShwClasses = [
            {className: 'panel_clsd'},
            {className: 'panel_open'},
            {className: 'panel'},
            {className: 'panel-default'},
            {className: 'col-md-2'},
            {className: 'front'},
            {className: 'back'}
        ];

        var usrShwFctry = {};
        usrShwFctry.getUsrShws = function () {
            return usrShws;
        };
        usrShwFctry.getUsrShws1 = function () {
            return usrShws1;
        };
        usrShwFctry.getUsrShws2 = function () {
            return usrShws2;
        };
        usrShwFctry.getShwClasses = function () {
            return usrShwClasses;
        };
        return usrShwFctry;
    }]);
}(angular.module('app')));
