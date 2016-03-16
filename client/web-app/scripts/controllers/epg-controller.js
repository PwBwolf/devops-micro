(function (app){
    'use strict'
    console.log('hello')
    app.controller('epgCtrl', ['$scope', '$rootScope', '$timeout', 'mediaSvc', '$filter', '$cookies', function ($scope, $rootScope, $timeout, mediaSvc, $filter, $cookies) {
        $scope.logos = []
        $scope.programming = []
        $scope.favoriteChannels = []
        $scope.recentChannels = []
        $scope.allChannels = []

        activate()

        function activate(){
            getTimeSlots()

            $rootScope.$on('ChannelsLoaded', function () {
                getLogos()
                getProgramming()
            });

            $scope.$on('ChannelFilterEvent', function(event, args) {
                updateChannelGuide($rootScope.filteredChannels);
            });

            mediaSvc.getFavoriteChannels(
                function (data) {
                    $scope.favoriteChannels = data;
                    console.log('playerCtrl - favorite channels: ' + data.length);
                    console.log('logging favorite channels', $scope.favoriteChannels)
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        function getTimeSlots() {
            var hoursOffset = 0
            var currentSlot = new Date();
            var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30))
            startSlot = startSlot  * 1000 * 60 * 30
            var timeSlots = [];
            $scope.timeSlots = []

            for (var i = 0; i < 16; i++) {
                hoursOffset = 1800 * 1000 * i
                $scope.timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
            }
        }

        function getLogos() {
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });

            var counter = 0
            angular.forEach(channelIds, function(channelId) {
                var station = channelId;
                var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                var channelTitle = $rootScope.filteredChannels[chIndex].title;

                var logoInformation = {
                    station: channelId,
                    chIndex: _.findIndex($rootScope.filteredChannels, {id: station}),
                    logo:  $rootScope.filteredChannels[chIndex].logoUri,
                    channelTitle: $rootScope.filteredChannels[chIndex].title,
                }

                if(counter <= 5){
                    console.log('printing logo information', logoInformation)
                    counter++
                }

                $scope.logos.push(logoInformation)

            });
            console.log('logos ', $scope.logos.length)
        }

        function getProgramming() {
            var startDate = new Date();
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[0])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[1])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[2])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[3])
            $scope.channelIds = channelIds
            console.log('printing channelIds in epg-controller - getProgramming()', $scope.channelIds)

            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                $rootScope.channelsEpg = channelsEpg;

                angular.forEach(channelIds, function(channelId) {
                    var station = channelId;
                    var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    var epgIndex =  _.findIndex(channelsEpg, {channel_id: station});
                    var lineUp = [];

                    if(epgIndex >= 0){
                        lineUp = channelsEpg[epgIndex].programs;
                    }

                    if (lineUp === null){
                        lineUp = [{
                            title: 'Not Available',
                            description: 'Not Available'
                        }]
                    }

                    var programInfo = {
                        station: channelId,
                        chIndex: _.findIndex($rootScope.filteredChannels, {id: station}),
                        logo: $rootScope.filteredChannels[chIndex].logoUri,
                        channelTitle: $rootScope.filteredChannels[chIndex].title,
                        epgIndex: _.findIndex(channelsEpg, {channel_id: station}),
                        lineUp: lineUp
                    }

                    for(var i = 0; i < programInfo.lineUp.length; i++){
                        if(programInfo.lineUp[i].startTime){
                            programInfo.lineUp[i]["startHour"] = $filter('date')(programInfo.lineUp[i].startTime, 'h:mm')
                            programInfo.lineUp[i]["endHour"] = $filter('date')(programInfo.lineUp[i].endTime, 'h:mm')
                            programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"] + "\n" + programInfo.lineUp[i]["description"]
                            programInfo.lineUp[i]["length"] = showLength(programInfo.lineUp[i].startTime, programInfo.lineUp[i].endTime)
                            //console.log(programInfo.lineUp[i].startHour, programInfo.lineUp[i].endHour, programInfo.lineUp[i].length)
                        }
                        else{
                            programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"]
                        }
                    }

                    $scope.programming.push(programInfo)
                });
            }).error(function () {
                console.log('channel guide ctrl error bloc');
            });
            $scope.allChannels = $scope.programming
        }

        // format the objects in $scope.favoriteChannels to match what we have in $scope.programming above
        function favoriteChannels(){
            console.log('logging favorite channels', $scope.favoriteChannels)
        }
         /**
         * $scope.favoriteChannels = []
         * $scope.recentChannels = []
         * $scope.allChannels = []
         *
         * mediaSvc gets the users favorite channels
         * set them to $scope.favoriteChannels
         *
         * set programming to allChannels by default
         *
         * set programming to favoriteChannels when the favorite button is
         * clicked
         *
         * set programming to recentChannels when the recent button is clicked
         *
         * Logic to handle recent channels:
         * - drop a cookie with the recent channel name when a channel is clicked
         * - get all the cookies, make a recent channel array, set programming to
             recentChannels
         * Put previous channel and next channel function in here. make sure they
         * only work on currently visible channels
         *
         * put toggleFavoriteChannel functionality in the EPG
         *
         * "station" property in logo objects in $scope.logos corresponds to "id" in
         * filtered channel objects which becomes $scope.channelIds. this is an array
         * of only channel ids. matches up with "station" property on $scope.programming objects.


         */

        $scope.previousChannel = function () {
            console.log('Get the previos channel in the current progrmas array')
        };

        $scope.nextChannel = function () {
            console.log('Get the next channel in the current programs array')
        };

        $scope.displayRecent = function() {
            console.log('showing recents')
            $scope.programming = $scope.recentChannels;
        };

        $scope.displayFavorites = function(thisIsNewChannelIndex) {
            console.log(thisIsNewChannelIndex);
            console.log('EPG set the favorite channels')
            console.log('favorites', $scope.favoriteChannels)
            $scope.programming = $scope.favoriteChannels;
            console.log($scope.programming)
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

            console.log('current channel in toggleFavoriteChannel', currentChannel)
            console.log(currentChannel.channelId);

            var checkIndex =$scope.favoriteChannels.indexOf({channelId: currentChannel.channelId})
            console.log('chechIndex is number in favorites ', checkIndex);

            if(checkIndex === -1 ){ // check $scope.favoriteChannels to see if it's in there
                console.log('channel not found in favorites')
                var req = {channelId: currentChannel.channelId};

                mediaSvc.addFavoriteChannel(
                    req,
                    function (data) {
                        console.log('playerCtrl - add favorite channel succeed:' + currentChannel.channelId);
                        $scope.favoriteChannels.push({channelId: currentChannelIndex.channelId});
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
            }

            // remove favorite channelconsole.log('this channel is playing ' + currentChannelIndex);
            var index = _.findIndex($scope.favoriteChannels, {channelId: currentChannel.channelId});
            console.log(index);

        },
            //if( index >= 0 ) {
            //    console.log('removing from favoritesChannels $scope');
            //    $scope.favoriteChannels.splice(index, 1);
            //    console.log($scope.favoriteChannels);
            //    $scope.favoriteIcon = '../../images/favorite_white.png';
            //    var req = {channelId: currentChannelIndex.channelId};
            //    mediaSvc.removeFavoriteChannel(
            //        req,
            //        function (data) {
            //            console.log('playerCtrl - remove favorite channel succeed:' + currentChannelIndex.channelId);
            //        },
            //        function (error) {
            //            console.log('playerCtrl - remove favorite channel failed:' + currentChannelIndex.channelId);
            //            console.log(error);
            //        }
            //
            //    );
            //
            //// add favorite channel to the favorite channel array and add it to the user's profile in the db
            //$scope.favoriteChannels.push({channelId: currentChannelIndex.channelId});
            //$scope.favoriteIcon = '../../images/favorite_yellow.png';
            //var req = {channelId: currentChannelIndex.channelId};
            //mediaSvc.addFavoriteChannel(
            //    req,
            //    function (data) {
            //        console.log('playerCtrl - add favorite channel succeed:' + currentChannelIndex.channelId);
            //    },
            //    function (error) {
            //        console.log('playerCtrl - add favorite channel failed:' + currentChannelIndex.channelId);
            //        console.log(error);
            //    }
            //);
            //console.log($scope.favoriteChannels);

        $scope.currentChannelIndex = function(index){
            console.log('logging index for peter with $index', index)
        }

        function showLength(startTime, endTime){
            var lastHalfHour = Math.floor(new Date().getTime() / (1000 * 60 * 30))
            lastHalfHour = lastHalfHour  * 1000 * 60 * 30
            startTime = new Date(startTime).getTime()
            endTime = new Date(endTime).getTime()

            if(startTime < lastHalfHour){
                var showRemaining = (endTime - lastHalfHour) / 1000 / 60
                return showRemaining
            }
            else{
                var showLength = (endTime - startTime) / 1000 / 60
                return showLength
            }
        }


    }])
}(angular.module('app')));
