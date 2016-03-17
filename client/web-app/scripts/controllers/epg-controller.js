(function (app){
    'use strict'
    console.log('hello')

    angular
        .module('app')
        .controller('epgCtrl', epgCtrl)

    epgCtrl.$inject=['$scope', '$rootScope', 'mediaSvc', '$filter', '$cookies', 'epgSrvc']

    function epgCtrl($scope, $rootScope, mediaSvc, $filter, $cookies, epgSrvc){
        console.log('hello from inside epg function indfjaslfkjasdlk')
        $scope.logos = []
        $scope.programming = []
        $scope.favoriteChannels = []
        $scope.recentChannels = []
        $scope.allChannels = []
        $scope.timeSlots = []

        activate()

        function activate(){
            $scope.timeSlots = epgSrvc.getTimeSlots()

            $rootScope.$on('ChannelsLoaded', function () {
                $scope.logos = epgSrvc.getLogos()
                epgSrvc.getProgramming(function(err, programming){
                    if(err){
                        console.error(err)
                        console.error('could not get channel information. aborting.')
                        return
                    }
                    $scope.allChannels = programming
                    $scope.programming = programming
                    mediaSvc.getFavoriteChannels(
                        function (data) {
                            console.log('data received from getFavoriteChannels ',data)
                            //$scope.favoriteChannels = data;
                            $scope.favoriteChannels = epgSrvc.formatFavorites(data);
                            // console.log('playerCtrl - favorite channels: ' + data.length);
                            // console.log('logging favorite channels', $scope.favoriteChannels)

                            $scope.favoriteChannels = epgSrvc.mapChannels($scope.favoriteChannels, $scope.allChannels)
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
                })
            });

            $scope.$on('ChannelFilterEvent', function(event, args) {
                updateChannelGuide($rootScope.filteredChannels);
            });


        }

         /**
         * Put previous channel and next channel function in here. make sure they
         * only work on currently visible channels

         * "station" property in logo objects in $scope.logos corresponds to "id" in
         * filtered channel objects which becomes $scope.channelIds. this is an array
         * of only channel ids. matches up with "station" property on $scope.programming objects.
         */

        $scope.previousChannel = function () {
            console.log('Get the previos channel in the current programs array')
        };

        $scope.nextChannel = function () {
            console.log('Get the next channel in the current programs array')
        };

        $scope.displayRecent = function() {
            // console.log('showing recents')
            var recentPrograms = $cookies.recent;
            var recentCookies = JSON.parse(recentPrograms);
            $scope.recentChannels = mapChannels(recentCookies);
            console.log($scope.recentChannels)
            $scope.programming = $scope.recentChannels;
        };

        // working
        $scope.displayFavorites = function() {
            // console.log('EPG set the favorite channels')
            // console.log('favorites', $scope.favoriteChannels)
            $scope.programming = $scope.favoriteChannels;
            // console.log('new $scope.programming with favoriteChannels', $scope.programming)
        };

        // working
        $scope.displayAll = function () {
            console.log('showing all channels')
            $scope.programming = $scope.allChannels;
        }

        // make a sure a channel is playing. taken care of by ng-hide
        // check if it's already a favorite channel. remove if it is.
        // make it a favorite channel if it's not.
        $scope.toggleFavoriteChannel = function(currentChannel){

            // console.log('current channel in toggleFavoriteChannel', currentChannel)
            // console.log(currentChannel.channelId);

            var channelIndex = $scope.favoriteChannels.map(function(e) { return e.station; }).indexOf(currentChannel.channelId);
            // var channelIndex =$scope.favoriteChannels.indexOf({channelId: currentChannel.channelId})
            // console.log('channelIndex is number in favorites ', channelIndex);

            if(channelIndex === -1 ){ // check $scope.favoriteChannels to see if it's in there
                // console.log('channel not found in favorites')
                var req = {channelId: currentChannel.channelId};

                mediaSvc.addFavoriteChannel(
                    req,
                    function (data) {
                        console.log('playerCtrl - add favorite channel succeed:' + currentChannel.channelId);
                        var newFavoriteId = {channelId: currentChannel.channelId}
                        var newFavoriteIndex = $scope.allChannels.map(function(e){return e.station}).indexOf(newFavoriteId.channelId)
                        var newFavoriteChannelObj = $scope.allChannels[newFavoriteIndex]
                        $scope.favoriteChannels.push(newFavoriteChannelObj)
                        $scope.favoriteIcon = '../../images/favorite_yellow.png';
                    },
                    function (error) {
                        console.log('playerCtrl - add favorite channel failed:' + currentChannel.channelId);
                        console.log(error);
                    }
                );
            }
            else {
                console.log('item is in favorites')
                console.log('removing from favoritesChannels $scope');
               $scope.favoriteChannels.splice(channelIndex, 1);
               console.log($scope.favoriteChannels);
               $scope.favoriteIcon = '../../images/favorite_white.png';
               var req = {channelId: currentChannel.channelId};
               mediaSvc.removeFavoriteChannel(
                   req,
                   function (data) {
                       console.log('playerCtrl - remove favorite channel succeed:' + currentChannel.channelId);
                   },
                   function (error) {
                       console.log('playerCtrl - remove favorite channel failed:' + currentChannel.channelId);
                       console.log(error);
                   }

               );
            }

            // remove favorite channel console.log('this channel is playing ' + currentChannel);
            var index = _.findIndex($scope.favoriteChannels, {channelId: currentChannel.channelId});
            console.log(index);

        }

        
    }
})();
