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
            }
        };
    }]);
}(angular.module('app')));
