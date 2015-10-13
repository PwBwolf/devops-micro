(function (app) {
    'use strict';

    app.factory('mediaSvc', ['$http', function ($http) {

        return {
            getChannelUrl: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-url',
                    params: {id: id}
                });
            },

            getChannelGuide: function (stationId, hours, canceller) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {stationId: stationId, hours: hours},
                    timeout: canceller.promise
                });
            },

            getUserChannels: function (type, success, error) {
                return $http({
                    method: 'GET',
                    url: '/api/get-user-channels',
                    params: {type: type}
                }).success(success).error(error);
            },

            getPromos: function (success, error) {
                $http.get('/api/get-promos').success(success).error(error);
            },

            getChannelCategories: function (success, error) {
                $http.get('/api/get-channel-categories').success(success).error(error);
            }

        };
    }]);
}(angular.module('app')));
