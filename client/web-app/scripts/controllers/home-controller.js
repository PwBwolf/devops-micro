(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', 'webStorage', function (appSvc, $scope, $window, webStorage) {

        var key = {
            en: {'localhost': '', '172.16.10.8': 'https://int.yiptv.net/live-tv/index.php/en/', 'app.int.yiptv.net': 'https://int.yiptv.net/live-tv/index.php/en/', '172.16.10.11': 'https://test.yiptv.net/live-tv/index.php/en/', 'app.test.yiptv.net': 'https://test.yiptv.net/live-tv/index.php/en/', 'app.yiptv.com': 'https://www.yiptv.com/live-tv/index.php/en/'},
            es: {'localhost': '', '172.16.10.8': 'https://int.yiptv.net/live-tv/index.php/es/', 'app.int.yiptv.net': 'https://int.yiptv.net/live-tv/index.php/es/', '172.16.10.11': 'https://test.yiptv.net/live-tv/index.php/es/', 'app.test.yiptv.net': 'https://test.yiptv.net/live-tv/index.php/es/', 'app.yiptv.com': 'https://www.yiptv.com/live-tv/index.php/es/'}
        };

        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
            var domain = location.hostname;
            var language = webStorage.local.get('language') ? webStorage.local.get('language') : 'en';
            if (key[language][domain]) {
                //$window.location.href = key[language][domain];
            }
        }
    }]);
}(angular.module('app')));
