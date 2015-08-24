(function (app) {
    'use strict';

    app.factory('mediaSvc', ['$http', function ($http) {

        return {
            getChannel: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel',
                    params: {id: id}
                });
            },

            getChannelGuide: function (stationId, hours) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {stationId: stationId, hours: hours}
                });
            },

            getUserChannels: function (success, error) {
                $http.get('/api/get-user-channels').success(success).error(error);
            },

            getPromoChannels: function (success, error) {
                $http.get('/api/get-promo-channels').success(success).error(error);
            },

            getChannelCategories: function (success, error) {
                $http.get('/api/get-channel-categories').success(success).error(error);
            }

        };
    }]);
}(angular.module('app')));
