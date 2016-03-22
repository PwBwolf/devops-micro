(function() {
   'use strict';

    angular
        .module('app')
        .service('channelsService', channelsService);

    channelsService.$inject = [ '$cookies'];

    function channelsService ($cookies) {
        var service = {
            displayFavoriteChannels : displayFavoriteChannels,
            displayAllChannels : displayAllChannels,
            displayRecentChannels : displayRecentChannels
        }
        return service;

       function displayFavoriteChannels () {
           // set the $scope.programing to the users saved favorite channels
           return
       };

        function displayAllChannels () {
            // set the $scope.programing to the $scope.allChannels variable

        };

        function displayRecentChannels ( ) {
            // set the $scope.programing to the recent saved cookies

        };
    };
})();
