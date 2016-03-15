(function(){
    'use strict'

    angular
        .module('app')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope','mediaSvc', '$window', '$rootScope', '$location', '$anchorScroll', 'channelsService']

    function playerCtrl ($scope, mediaSvc, $window, $rootScope, $location, $anchorScroll, channelsService) {
        $scope.watching = false;
        $scope.selectedPromo = -1;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];
        $scope.favoriteChannels = [];
        $scope.recentChannels = [];
        $scope.favoriteIcon = '../../images/favorite_white.png';
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = '';
        $scope.programDescription = '';
        $scope.showChannelFilter = false;
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

            mediaSvc.getFavoriteChannels(
                function (data) {
                    $scope.favoriteChannels = data;
                    console.log('playerCtrl - favorite channels: ' + data.length);

                },
                function (error) {
                    console.log(error);
                }
            );
        }

        $scope.watchNow = function (index, rowIndex) {
            if($scope.watching === false) {
                $scope.watching = true;
            }
            console.log(index + ' wathcNow')
            //if (rowIndex === 0) {
            //    $scope.playChannel(index);
            //    scrollToTop();
            //}
            mediaSvc.getChannelUrl($rootScope.channels[index].id).success(function (channelUrl) {
                /** DELETE AFTER TESTING
                $scope.tvUrl = channelUrl.routes[0];
                 */
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
                setFavoriteIcon($rootScope.channels[index].id); //check if channel is a favorite
                addRecentChannel(currentChannelIndex.channelId); //needs to be fixed to save to local storage.
                /**** DELETE AFTER TESTING
                //if(_.findIndex($scope.favoriteChannels, {channelId: $rootScope.channels[index].id}) >= 0) {
                //    $scope.favoriteIcon = '../../images/favorite_yellow.png';
                //} else {
                //    $scope.favoriteIcon = '../../images/favorite_white.png';
                //}*/

                $rootScope.$broadcast('PlayChannel', {currentIndex: index, previousIndex: previousChannelIndex.index});

                /**** DELETE AFTER TESTING
                //playStream();
                */
            }); //mediaSvc
        };

        /** Takes in the channel index id that was selected and checks if that is in the users saved favoritesChannel and
        /sets the favorite image to a yellow or white star
        */
        function setFavoriteIcon (channel) {
            if($scope.favoriteChannels.indexOf({channelId: channel}) >= 0) {
                $scope.favoriteIcon = '../../images/favorite_yellow.png';
                return
            } else {
                $scope.favoriteIcon = '../../images/favorite_white.png';
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


        $scope.previousChannel = function () {

        };

        $scope.nextChannel = function () {

        };

        $scope.toggleFavoriteChannel = function() {

        };

        $scope.gotoTop = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('topBox');
            // call $anchorScroll()
            $anchorScroll();
        };




        //////////////////// Functions  ////////////////////
        function addRecentChannel(channelId) {
            $window.localStorage.getItem('testObject');
            $window.localStorage.setItem('recentChannels', {channelId: channelId});
            //var index = _.findIndex($scope.recentChannels, {channelId: channelId});
            //if(index < 0) {
            //    $scope.recentChannels.push({channelId: channelId});
            //}
        }

        ////////////////////

    }
})()
