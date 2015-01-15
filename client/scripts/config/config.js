(function (app) {
    'use strict';

    app.factory('httpRequestInterceptor', ['tokenSvc', function (tokenSvc) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (tokenSvc.getToken()) {
                    config.headers.Authorization = 'Bearer ' + tokenSvc.getToken();
                }
                return config;
            }
        };
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }]);
}(angular.module('app')));
