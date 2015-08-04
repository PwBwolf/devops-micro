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
              }
        }
   }])
}(angular.module('myApp')));
