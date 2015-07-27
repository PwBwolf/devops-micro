(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', function (appSvc, $scope, $window) {
        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
            var key = {'localhost': '', 'int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv/', 'test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'staging.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/'};
            var domain = location.hostname;
            if (key[domain]) {
                $window.location.href = key[domain];
            }
        }
    }]);
}(angular.module('app')));
