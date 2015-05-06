(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', '$', function (appSvc, $scope, $window, $location, $) {
        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

        $scope.$watch(function () {
            return window.innerWidth;
        }, function (value) {
            var x = value;
            switch (true) {
                case (x < 768):
                    $scope.usrDataFile = {
                        'bnr': 'views/home-banner-mobile.html',
                        'shws': 'views/home-shows.html',
                        'ntwrks': 'views/home-networks.html',
                        'abt': 'views/home-about.html',
                        'app': 'views/home-app.html',
                        'ftr': 'views/home-footer-menu.html'
                    };
                    break;
                case (x > 767 && x < 1025):
                    $scope.usrDataFile = {
                        'bnr': 'views/home-banner-tablet.html',
                        'shws': 'views/home-shows.html',
                        'ntwrks': 'views/home-networks.html',
                        'abt': 'views/home-about.html',
                        'app': 'views/home-app.html',
                        'ftr': 'views/home-footer-menu.html'
                    };
                    break;
                case (x > 1025):
                    $scope.usrDataFile = {
                        'bnr': 'views/home-banner.html',
                        'shws': 'views/home-shows.html',
                        'ntwrks': 'views/home-networks.html',
                        'abt': 'views/home-about.html',
                        'app': 'views/home-app.html',
                        'ftr': 'views/home-footer-menu.html'
                    };
                    break;
            }
        });

        var mnuBtns = ['pgCntnt', 'Shws', 'Ntwrks', 'Abt', 'Orders'];

        for (var j = 0; j < 5; j++) {
            $('#' + mnuBtns[j]).on('click', function () {
                var dPg = $(this).attr('id');
                var dSite = $('html, body');
                dSite.animate({
                    scrollTop: $('#' + dPg + '_Bx').offset().top - 30
                }, 1500);
                return false;
            });
        }
    }]);
}(angular.module('app')));
