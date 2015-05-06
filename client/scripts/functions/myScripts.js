(function (app) {
    'use strict';

    app.directive('resize', function ($window) {
        return function ($scope, element, attr) {
            var w = angular.element($window);
            $scope.$watch(function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            }, function (newValue, oldValue) {
                $scope.windowHeight = newValue.h;
                $scope.windowWidth = newValue.w;
            }, true);

            w.bind('resize', function () {
                $scope.$apply();
            });
        };
    })




        .factory('usrShowsFctry', function () {
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
        })


        .factory('usrDevicesFctry', function () {
            var usrDvcs = [
                {dvcNm: 'personal', dvcImg: 'img/dvcs/devices.gif', dvcDesc1: 'cellular device', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'gaming', dvcImg: 'img/dvcs/gameVector.gif', dvcDesc1: 'Playstation, Xbox, Computer', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'roku', dvcImg: 'img/dvcs/roku.gif', dvcDesc1: 'Roku-stick', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'tvbox', dvcImg: 'img/dvcs/Apple_TV.gif', dvcDesc1: 'AppleTV, AmazonTV', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'smartv', dvcImg: 'img/dvcs/smartTV.gif', dvcDesc1: 'Any SmartTV with Internet capabiities', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
            ];

            var usrDvcClasses = [
                {className: 'off'},
                {className: 'on'}
            ];

            var usrDvc = {};
            usrDvc.getUsrDvcs = function () {
                return usrDvcs;
            };
            usrDvc.getDvcClass = function () {
                return usrDvcClasses;
            };
            return usrDvc;
        })



        .controller('usrBnrsCntrlr', function ($scope, usrBnrsFctry) {

            $scope.en_Bnrs = [];
            $scope.sp_Bnrs = [];

            $('#slider').nivoSlider({
                pauseTime: 6000
            });

        })

        .controller('usrScrnsCntrlr', function ($scope, usrScrnsFctry) {
            $scope.usrMnScrn = {};
            $scope.usrFavs = [];
            $scope.usrSgstns = [];
            $scope.usrScrnClasses = {};
            $scope.usrCntnt = {};

            init();

            function init() {
                $scope.usrMnScrn = usrScrnsFctry.getUsrData();
                $scope.usrFavs = usrScrnsFctry.getUsrFavs();
                $scope.usrSgstns = usrScrnsFctry.getUsrSgstns();
                $scope.usrScrnClasses = usrScrnsFctry.getUsrClass();
            }

            $scope.selectedIndex = -1;
            $scope.itemClicked = function ($index) {
                $scope.selectedIndex = $index;
            };
        })


        .controller('usrShwsCntrlr', function ($scope, usrShowsFctry) {
            init();
            function init() {
                $scope.usrShws = usrShowsFctry.getUsrShws();
                $scope.usrShws1 = usrShowsFctry.getUsrShws1();
                $scope.usrShws2 = usrShowsFctry.getUsrShws2();
                $scope.usrShwClasses = usrShowsFctry.getShwClasses();
            }

            $scope.selectedIndex = -1;

            $scope.itemClicked = function ($index) {
                $scope.selectedIndex = $index;
            };

            $scope.itemClicked2 = function ($index) {
                $scope.selectedIndex2 = $index;
            };

            $scope.itemClicked3 = function ($index) {
                $scope.selectedIndex3 = $index;
            };
        })

        .controller('usrNtwrksCntrlr', function ($scope, usrNetworksFctry) {

        })
}(angular.module('app')));
