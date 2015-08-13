(function (app) {
    'use strict';

    app.factory('channelSvc', function () {
        var channelid;
        return {
            setChannel: function(channelID) {
                channelid = channelID;	
            },
            getChannel: function() {
                return channelid;
            }
        }
   })
}(angular.module('myApp')));
