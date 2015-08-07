(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window','webStorage', function (appSvc, $scope, $window, webStorage) {

        var key = {
            en: {'localhost': '', 'int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv/', 'test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/'},
            es: {'localhost': '', 'int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv-home-2/', 'test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv-home-2/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/'}
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
