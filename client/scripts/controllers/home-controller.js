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

        $scope.$watch(function () {
            return window.innerWidth;
        }, function (value) {
            var x = value;
            switch (true) {
                case (x < 768):
                    $scope.content = {
                        'banners': 'views/banner-mobile.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 767 && x < 1025):
                    $scope.content = {
                        'banners': 'views/banner-tablet.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 1025):
                    $scope.content = {
                        'banners': 'views/banner-desktop.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
            }
        });

    }]);
}(angular.module('app')));
