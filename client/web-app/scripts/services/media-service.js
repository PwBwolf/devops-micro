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

            getChannelGuide: function (id, hours, canceller) {
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide',
                    params: {id: id, hours: hours},
                    timeout: canceller.promise
                });
            },

            getChannelGuideAll: function (id, hours) {
                console.log('mediaservice getchannelguide 222');
                return $http({
                    method: 'GET',
                    url: '/api/get-channel-guide-all',
                    params: {id: id, hours: hours}
                    
                });
            },
            
            getUserChannels: function (success, error) {
                return $http({
                    method: 'GET',
                    url: '/api/get-user-channels'
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
