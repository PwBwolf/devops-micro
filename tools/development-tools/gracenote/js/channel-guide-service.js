(function (app) {
    'use strict';

    app.factory('channelGuideSvc', ['$http', '$q', function ($http, $q) {

        var data = [],
            lastRequestFailed = true,
            promise;
        return {
            getChannelGuide: function() {
                if(!promise || lastRequestFailed) {
                    // $http returns a promise, so we don't need to create one with $q
                    promise = $http.get('/channelguide')
                    .then(function(res) {
                        lastRequestFailed = false;
                        data = res.data;
                        return data;
                    }, function(res) {
                        return $q.reject(res);
                    });
                }
                return promise;
            },
            
            getChannelList: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/channellist',
                    params: {stationIds: req.stationIds}
                }).success(success).error(error);
                
            },
            
            getChannelInfo: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/channellist/channel',
                    params: {stationId: req.stationId, hour: req.hour, period: req.period}
                }).success(success).error(error);
                
            },
            
            getProgramDetail: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/channellist/channel/program',
                    params: {tmsid: req.tmsid, stationId: req.stationId}
                }).success(success).error(error);
            }
        }
   }])
}(angular.module('myApp')));
