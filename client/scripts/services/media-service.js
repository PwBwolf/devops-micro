(function (app) {
    'use strict';

    app.factory('mediaSvc', ['$http', function ($http) {

        return {
            getChannel: function (channelId) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel',
                    params: {channelId: channelId}
                });
            },

            getChannels: function (user) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channels',
                    params: {duser: user}
                });
            },

            getChannelGuide: function (stationId) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {stationId: stationId},
                    cache: true
                });
            }
        };
    }]);
}(angular.module('app')));
