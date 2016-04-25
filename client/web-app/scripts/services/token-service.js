(function (app) {
    'use strict';

    app.factory('tokenSvc', ['webStorage', function (webStorage) {
        var token;

        return {
            setToken: function (isPersistent, accessToken) {
                this.clearToken();
                token = accessToken;
                if (isPersistent) {
                    webStorage.local.remove('token');
                    webStorage.local.set('token', token);
                } else {
                    webStorage.session.remove('token');
                    webStorage.session.set('token', token);
                }
            },

            clearToken: function () {
                token = null;
                webStorage.local.remove('token');
                webStorage.session.remove('token');
            },

            getToken: function () {
                if (token) {
                    return token;
                } else if (webStorage.session.get('token')) {
                    token = webStorage.session.get('token');
                    return token;
                } else {
                    token = webStorage.local.get('token');
                    return token;
                }
            }
        };
    }]);
}(angular.module('app')));
