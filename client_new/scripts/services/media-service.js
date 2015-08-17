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
            
            /*
            getChannels: function (api_key) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channels',
                    params: {
                        api_key: api_key,
                    }
                });
            },
            */
            
            getChannels: function (user) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channels',
                    params: {duser: user}
                });
            },

            getChannelGuide: function (stationId, name) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {stationId: stationId, name: name},
                    cache: true,
                });
            }
        };
    }]);
}(angular.module('app')));
