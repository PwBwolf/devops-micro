(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', 'webStorage', function (appSvc, $scope, $window, webStorage) {

        var key = {
            en: {'localhost': '', '172.16.10.8': 'http://172.16.10.104/blog/index.php/yiptv/', 'app.int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv/', '172.16.10.11': 'http://172.16.10.105/live-tv/index.php/yiptv/', 'app.test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/'},
            es: {'localhost': '', '172.16.10.8': 'http://172.16.10.104/blog/index.php/yiptv-home-2/', 'app.int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv-home-2/', '172.16.10.11': 'http://172.16.10.105/live-tv/index.php/yiptv-home-2/', 'app.test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv-home-2/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/'}
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
                $window.location.href = key[language][domain];
            }
        }

    }]);
}(angular.module('app')));
