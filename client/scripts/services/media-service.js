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
                    params: {stationId: stationId, hours: hours},
                    cache: true
                });
            },

            getUserChannels: function (success, error) {
                $http.get('/api/get-user-channels', {cache: true}).success(success).error(error);
            },

            getPromoChannels: function (success, error) {
                $http.get('/api/get-promo-channels', {cache: true}).success(success).error(error);
            }
        };
    }]);
}(angular.module('app')));
