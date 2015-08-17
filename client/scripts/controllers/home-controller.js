(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', 'webStorage', 'prflButtons', function (appSvc, $scope, $window, webStorage, prflButtons) {

        var key = {
            en: {'localhost': '', '172.16.10.8': 'http://int.yiptv.net/blog/index.php/yiptv/', 'app.int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv/', '172.16.10.11': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'app.test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv/'},
            es: {'localhost': '', '172.16.10.8': 'http://int.yiptv.net/blog/index.php/yiptv-home-2/', 'app.int.yiptv.net': 'http://int.yiptv.net/blog/index.php/yiptv-home-2/', '172.16.10.11': 'http://test.yiptv.net/live-tv/index.php/yiptv-home-2/', 'app.test.yiptv.net': 'http://test.yiptv.net/live-tv/index.php/yiptv-home-2/', 'yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/', 'www.yiptv.com': 'http://yiptv.com/live-tv/index.php/yiptv-home-2/'}
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
            init();
        }

        function init() {

            $scope.prflSlctns = prflButtons.getPfrlSlctns();
            $scope.dUsr = $scope.user;
            $scope.isSlctd = false;
            $scope.slctdPrflItm = -1;
            $scope.slctdAcctPnl = -1;
        }



        $scope.usrDataFile = {
            'cntnt': 'views/home-scrns.html',
            'chnls': 'views/home-chnls.html',
            'guide': 'views/home-guide.html',
            'langPrefs': 'views/preferences.html',
            'usrPrfl': 'views/user-info.html',
            'usrPwd': 'views/change-password.html'
        };
    }]);
}(angular.module('app')));
