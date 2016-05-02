(function (app) {
    'use strict';

    app.factory('mediaSvc', ['$http', '$q', function ($http, $q) {
        return {
            getChannelUrl: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-url',
                    params: {id: id}
                });
            },

            getChannelGuide: function (id, hours, canceller) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {id: id, hours: hours},
                    timeout: canceller.promise
                });
            },

            getEpg: function (id, hours) {
                return $http({
                    method: 'GET',
                    url: '/api/get-epg',
                    params: {id: id, hours: hours}

                });
            },

            getUserChannels: function (success, error) {
                return $http({
                    method: 'GET',
                    url: '/api/get-user-channels'
                }).success(success).error(error);
            },

            getChannelCategories: function (success, error) {
                $http.get('/api/get-channel-categories').success(success).error(error);
            },

            getFavoriteChannels: function(success, error) {
                $http({
                    method: 'GET',
                    url: '/api/get-favorite-channels'
                }).success(success).error(error);
            },

            addFavoriteChannel: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/api/add-favorite-channel',
                    params: {channelId: req.channelId}
                }).success(success).error(error);
            },

            removeFavoriteChannel: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/api/remove-favorite-channel',
                    params: {channelId: req.channelId}
                }).success(success).error(error);
            }

        };
    }]);
}(angular.module('app')));
