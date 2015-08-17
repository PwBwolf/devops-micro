(function (app) {
    'use strict';

    app.factory('channelGuideSvc', ['$http', '$q', function ($http, $q) {

        var data = [],
            lastRequestFailed = true,
            promise;
        
        var appConfig = {};
        var promiseAppConfig;
        var lastAppConfigReqFailed = true;
        
        return {
        /*    
            getAppConfig: function() {
                if(!promiseAppConfig || lastAppConfigReqFailed) {
                    // $http returns a promise, so we don't need to create one with $q
                    promiseAppConfig = $http.get('/appconfig')
                    .then(function(res) {
                        lastAppConfigReqFailed = false;
                        appConfig = res.data;
                        return appConfig;
                    }, function(res) {
                        return $q.reject(res);
                    });
                }
                return promiseAppConfig;
            },
        */
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
                    url: '/metadata/api/get-channel-list',
                    params: {stationIds: req.stationIds}
                }).success(success).error(error);
                
            },
            
            getChannelInfo: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/metadata/api/get-channel-info',
                    params: {stationId: req.stationId, hour: req.hour, period: req.period}
                }).success(success).error(error);
                
            },
            
            getProgramDetail: function(req, success, error) {
                $http({
                    method: 'GET',
                    url: '/metadata/api/get-program-detail',
                    params: {tmsId: req.tmsId, stationId: req.stationId, startTime: req.startTime}
                }).success(success).error(error);
            }
        }
   }])
}(angular.module('myApp')));
