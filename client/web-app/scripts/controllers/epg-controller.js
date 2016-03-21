(function (app){
    'use strict'
    console.log('hello')

    angular
        .module('app')
        .controller('epgCtrl', epgCtrl)

    epgCtrl.$inject=['$scope', '$rootScope', 'mediaSvc', '$filter', '$cookies', 'epgSrvc', '$location', '$anchorScroll']

    function epgCtrl($scope, $rootScope, mediaSvc, $filter, $cookies, epgSrvc, $location, $anchorScroll){
        console.log('hello from inside epg function indfjaslfkjasdlk')
        // epg related variables
        $scope.programming = []
        $scope.favoriteChannels = []
        $scope.recentChannels = []
        $scope.allChannels = []
        $scope.timeSlots = []

        // playing channel related variables
        $scope.currentChannel = {};
        $scope.mainUrl === undefined;
        $scope.watching = false;
        $scope.selectedPromo = -1;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];
        $scope.recentChannels = [];
        $scope.favoriteIcon = '../../images/favorite_white.png';
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = '';
        $scope.programDescription = '';
        $scope.showChannelFilter = false;
        $scope.currentChannel = {};
        $scope.mainUrl === undefined;

        $scope.tags = []

        // for previous and next channels. These may not need to be on $scope at all.
        $scope.prevIndex = 0
        $scope.nextIndex = 0
        $scope.noRecentChannels = false

        var displayingAll = true
        var displayingFavorites = false
        var displayingRecents = false
        var channelPaging = 1

        var currentChannelIndex = {index: undefined, channelId: undefined};
        var previousChannelIndex = {index: undefined, channelId: undefined};

        activate()

        function activate(){
            $scope.timeSlots = epgSrvc.getTimeSlots()

            $rootScope.$on('ChannelsLoaded', function () {
                epgSrvc.getProgramming(function(err, programming){
                    if(err){
                        console.error(err)
                        console.error('could not get channel information. aborting.')
                        return
                    }
                    $scope.allChannels = programming
                    console.log('full object from allChannels', $scope.allChannels[0])
                    //$scope.programming = programming.slice(0, 11)
                    $scope.programming = $scope.allChannels
                    mediaSvc.getFavoriteChannels(
                        function (data) {
                            console.log('data received from getFavoriteChannels ',data)
                            //$scope.favoriteChannels = data;
                            $scope.favoriteChannels = epgSrvc.formatFavorites(data);
                            // console.log('playerCtrl - favorite channels: ' + data.length);
                            // console.log('logging favorite channels', $scope.favoriteChannels)

                            $scope.favoriteChannels = epgSrvc.mapChannels($scope.favoriteChannels, $scope.allChannels)
                            console.log('favorites array', $scope.favoriteChannels)
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

            // copied and pasted from the player controller
            mediaSvc.getUserChannels(function (data) {
                console.log(data)
                $rootScope.channels = data.channels_list;
                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            });
            //call to get current promotion that should be displayed on free users view
            mediaSvc.getPromos(function (data) {
                $scope.promos = data.ads;
            });

            mediaSvc.getChannelCategories(function (data) {
                var dataCategories = data.categories;
                $rootScope.channelCategories = data.categories;
                console.log('logging response from mediaSvc.getChannelCategories', data)
            
                for(var i = 0; i < dataCategories.length; i++) {
                    var genre = dataCategories[i].tags;
                    for(var j = 0; j < genre.length; j++) {
                        if(j%2 == 0) {
                            $rootScope.channelCategories[i].tags[j].col = 0;
                        } else {
                            $rootScope.channelCategories[i].tags[j].col = 1;
                        }
                    }
                }
                $scope.tags = $rootScope.channelCategories
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
            $scope.watchNow($scope.prevIndex, $scope.favoriteChannels)
        };

        $scope.nextChannel = function () {
            console.log('Get the next channel in the current programs array')
            $scope.watchNow($scope.nextIndex, $scope.favoriteChannels)
        };

        $scope.displayRecent = function() {
            // console.log('showing recents')
            displayingRecents = true
            displayingFavorites = false
            displayingAll = false

            var recentPrograms = $cookies.recent;
            if(recentPrograms){
                var recentCookies = JSON.parse(recentPrograms);   
                $scope.noRecentChannels = false             
            }
            else{
                $scope.noRecentChannels = true
                $scope.programming = $scope.recentChannels;
                return
            }
            $scope.recentChannels = epgSrvc.mapChannels(recentCookies, $scope.allChannels);
            console.log($scope.recentChannels)
            $scope.recentChannels.sort(function(a, b){
                if(a.chIndex > b.chIndex){
                    return 1
                }
                if(a.chIndex < b.chIndex){
                    return -1
                }
            })
            $scope.programming = $scope.recentChannels//.slice(0, 11);
        };

        // working
        $scope.displayFavorites = function() {
            // console.log('EPG set the favorite channels')
            // console.log('favorites', $scope.favoriteChannels)
            displayingFavorites = true
            displayingAll = false
            displayingRecents = false

            $scope.noRecentChannels = false  
            $scope.favoriteChannels.sort(function(a, b){
                if(a.chIndex > b.chIndex){
                    return 1
                }
                if(a.chIndex < b.chIndex){
                    return -1
                }
            })
            $scope.programming = $scope.favoriteChannels////.slice(0, 11);
            // console.log('new $scope.programming with favoriteChannels', $scope.programming)
        };

        // working
        $scope.displayAll = function () {
            displayingAll = true
            displayingFavorites = false
            displayingRecents = false

            $scope.noRecentChannels = false
            console.log('showing all channels')
            $scope.programming = $scope.allChannels//.slice(0, 11);
        }

        // make a sure a channel is playing. taken care of by ng-hide
        // check if it's already a favorite channel. remove if it is.
        // make it a favorite channel if it's not.
        $scope.toggleFavoriteChannel = function(currentChannel){

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
        }

        $scope.$on('bottom-reached-before', function() {
        // do whatever you want
        console.log('add new channels while scrolling')
        });

        $scope.watchNow = function (index, favoriteChannels) {
            var favorites = favoriteChannels;

            if($scope.watching === false) {
                $scope.watching = true;
            }
            console.log('index in watchNOw', index, $rootScope.channels[index])
            // find the index of the channel where index === chIndex
            var indexOfClickedChannel = $scope.programming.map(function(e){return e.chIndex}).indexOf(index)
            console.log('indexOfClickedChannel', indexOfClickedChannel)

            // set $socpe.prevIndex
            if(indexOfClickedChannel > 0){
                $scope.prevIndex = $scope.programming[indexOfClickedChannel - 1].chIndex
            }
            else if(indexOfClickedChannel === 0){
                $scope.prevIndex = $scope.programming[$scope.programming.length - 1].chIndex
            }
            else{
                $scope.prevIndex = $scope.programming[0].chIndex
            }

            // set $scope.nextIndex
            if(indexOfClickedChannel === ($scope.programming.length-1)){
                $scope.nextIndex = 0
            }
            else{
                $scope.nextIndex = $scope.programming[indexOfClickedChannel + 1].chIndex
            }
            // tak the current index and get the previous and next index if they exist in the array
            // else set them to 0 so it's the first element of the array
            // then get the id of each of the prev, curr and next channels
            // set the prev and next vars to the ids of those channels. check if channels with those  ids
            // exists in $scope.programming when calling $scopeprev and next.
            //
            mediaSvc.getChannelUrl($rootScope.channels[index].id).success(function (channelUrl) {
                console.log('running mediaSvc getChannelUrl')
                $scope.mainUrl = channelUrl.routes[0];
                console.log($scope.mainUrl);
                $scope.tvProgram = $rootScope.channelsEpg[index].programs;
                $scope.channelLogo = $rootScope.channels[index].logoUri;
                var programInfo = getProgramInfo(index);
                $scope.programTitle = programInfo.title;
                $scope.programDescription = programInfo.description;
                previousChannelIndex.index = currentChannelIndex.index;
                currentChannelIndex.index = index;
                currentChannelIndex.channelId = $rootScope.channels[index].id;
                setFavoriteIcon($rootScope.channels[index].id, favorites); //check if channel is a favorite
                addRecentChannel(currentChannelIndex.channelId); //needs to be fixed to save to local storage.
                $scope.currentChannel.index = currentChannelIndex.index
                $scope.currentChannel.channelId = $rootScope.channels[index].id
                $rootScope.$broadcast('PlayChannel', {currentIndex: index, previousIndex: previousChannelIndex.index});
                // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('topBox');
            // call $anchorScroll()
            $anchorScroll();
            }); //mediaSvc
        };

        $scope.loadMore = function(){
            console.log('in loadMore')
            if(displayingAll){
                $scope.programming = appendChannels($scope.programming, $scope.allChannels, channelPaging)
            }
            else if(displayingRecents){
                $scope.programming = appendChannels($scope.programming, $scope.recentChannels, channelPaging)
            }
            else if(displayingFavorites){
                $scope.programming = appendChannels($scope.programming, $scope.favoriteChannels, channelPaging)
            }
        }

        // displaying is the current value of $scope.programming
        // appending is the array the new channels are coming from 
        // (favorites, recents, all) startIndex is the position in the
        // appending array that isn't already in $scope.programming
        function appendChannels(displaying, appending, startPage){
            console.log('in append channels', displaying, appending, startPage)
            var diff = appending.length - displaying.length
            var startIndex = startPage * 10
            channelPaging++
            var remaining = 0
            if(diff >= 10){
                remaining = 10
            }
            else{
                remaining = diff
            }
            for(var i = 0; i < remaining; i++){
                displaying.push(appending[startIndex + i])
            }
            return displaying
        }

        /** Takes in the channel index id that was selected and checks if that is in the users saved favoritesChannel and
        /sets the favorite image to a yellow or white star
        */
        function setFavoriteIcon (channel, favorites) {
            var isfavorite = favorites.map(function(e){return e.station}).indexOf(channel)
            //console.log(isfavorite);
            //console.log('check if this current channel ', channel);
            //console.log(' in in this favores list ', favorites);
            if(isfavorite === -1) {
                console.log('setting star to white. this is NOT a favorite.')
                $scope.favoriteIcon = '../../images/favorite_white.png';
                return
            } else {
                $scope.favoriteIcon = '../../images/favorite_yellow.png';
                return
            }

        } //setFavoriteIcon

        function getProgramInfo(index) {
            var epgIndex = $rootScope.channelsEpg.indexOf({channel_id: $rootScope.channels[index].id})
            /** DELETE AFTER TESTING
            var epgIndex = _.findIndex($rootScope.channelsEpg, {channel_id: $rootScope.channels[index].id});
            */
            var lineUp = [];
            var info = {title: '', description: '', showTime: 'Show Time ...'};
            var now = new Date();
            if(epgIndex >= 0) {
                lineUp = $rootScope.channelsEpg[epgIndex].programs;
                var endTime;
                if(lineUp && lineUp.length > 0) {
                    for(var i = 0; i < lineUp.length; ++i) {
                        endTime = new Date(lineUp[i].endTime);
                        if(now < endTime) {
                            info.title = lineUp[i].title;
                            info.description = lineUp[i].description;

                            var startTime = new Date(lineUp[i].startTime);
                            info.showTime = (startTime.getHours() % 12 ? startTime.getHours() % 12 : 12) + ':' + pad(startTime.getMinutes()) + ' ' + (startTime.getHours() >= 12 ? 'PM' : 'AM' ) + ' - ' + (endTime.getHours() % 12 ? endTime.getHours() % 12 : 12) + ':' + pad(endTime.getMinutes()) + ' ' + (endTime.getHours() >= 12 ? 'PM' : 'AM');

                            break;
                        }
                    }
                }
            }
            $rootScope.program = info;
            return info;
        } //getProgramInfo

        //////////////////// Functions  ////////////////////
        function addRecentChannel(channelId) {
            console.log('channelI in addRecentChannel', channelId)
            if($cookies.recent === undefined) {
                var updatedRecents= {};
                console.log('no recents')
                updatedRecents[channelId] = channelId
                $cookies.recent = JSON.stringify(updatedRecents)
                console.log('stringified cookie', JSON.stringify(updatedRecents))
                var recentCookies = $cookies.recent
                console.log(recentCookies)

            }
            else {
                var matchFound = false
                console.log('recent channels found');
                var recentCookies = $cookies.recent
                console.log('recent cookies', recentCookies)

                recentCookies = JSON.parse(recentCookies)
                console.log('recent cookies after parsing', recentCookies)
                for (var i in recentCookies) {
                    if(recentCookies.hasOwnProperty(i)) {
                        console.log(i);
                        if (channelId ===  i) {
                            matchFound = true
                        }

                    }
                }
                if (!matchFound) {
                    recentCookies[channelId] = channelId
                    var updatedRecents = JSON.stringify(recentCookies)
                    $cookies.recent = updatedRecents
                    console.log('recent cookies after adding value', recentCookies)
                }
                else {
                    console.log('cookie already exists')
                }
            }
        }

        
    }
})();
