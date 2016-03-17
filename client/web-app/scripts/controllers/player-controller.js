(function(){
    'use strict'

    angular
        .module('app')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope','mediaSvc', '$window', '$rootScope', '$location', '$anchorScroll', '$cookies']

    function playerCtrl ($scope, mediaSvc, $window, $rootScope, $location, $anchorScroll, $cookies) {
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
        var currentChannelIndex = {index: undefined, channelId: undefined};
        var previousChannelIndex = {index: undefined, channelId: undefined};
        activate();

        function activate() {
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
            });
        }

        $scope.watchNow = function (index, favoriteChannels) {
            var favorites = favoriteChannels;

            if($scope.watching === false) {
                $scope.watching = true;
            }
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
            }); //mediaSvc
        };

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


        $scope.gotoTop = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('topBox');
            // call $anchorScroll()
            $anchorScroll();
        };




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
            // var recentCookies = JSON.parse($cookies.recent)
            // console.log(recentCookies)
            // recentCookies[channelId] = channelId
            // var updatedRecents = JSON.stringify(recentCookies)
            // $cookies.recent = updatedRecents


        }

        ////////////////////

    }
})()
