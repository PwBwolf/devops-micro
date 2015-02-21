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
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }]);
}(angular.module('app')));
