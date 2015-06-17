(function (app) {
    'use strict';

    app.factory('browserSvc', ['$window', function ($window) {

        return {
            getBrowserName: function () {
                var userAgent = $window.navigator.userAgent;
                var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /MSIE/i};
                for (var key in browsers) {
                    if (browsers[key].test(userAgent)) {
                        return key;
                    }
                }
                return 'unknown';
            },

            getUserLanguage: function() {
                return $window.navigator.language || $window.navigator.userLanguage;
            }
        };
    }]);
}(angular.module('app')));
