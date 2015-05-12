(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', function (appSvc, $scope, $window) {
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
                    $scope.content = {
                        'banners': 'views/banner-mobile.html',
                        'shows': 'views/shows.html',
                        'networks': 'views/networks.html',
                        'about': 'views/about-yiptv.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 767 && x < 1025):
                    $scope.content = {
                        'banners': 'views/banner-tablet.html',
                        'shows': 'views/shows.html',
                        'networks': 'views/networks.html',
                        'about': 'views/about-yiptv.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 1025):
                    $scope.content = {
                        'banners': 'views/banner.html',
                        'shows': 'views/shows.html',
                        'networks': 'views/networks.html',
                        'about': 'views/about-yiptv.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
            }
        });
    }]);
}(angular.module('app')));
