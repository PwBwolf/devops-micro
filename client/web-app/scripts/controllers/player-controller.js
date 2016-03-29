(function (app) {
    'use strict';

    app.controller('playerCtrl', ['$scope', '$rootScope', 'mediaSvc', '$filter', 'playerSvc', '$location', '$anchorScroll', '$timeout', 'webStorage', '_', function ($scope, $rootScope, mediaSvc, $filter, playerSvc, $location, $anchorScroll, $timeout, webStorage, _) {
        // epg related variables
        $scope.programming = [];
        $scope.favoriteChannels = [];
        $scope.recentChannels = [];
        $scope.allChannels = [];
        $scope.filteredChannels = [];
        $scope.timeSlots = [];

        // playing channel related variables
        $scope.currentChannel = {};
        $scope.mainUrl = undefined;
        $scope.watching = false;
        $scope.selectedPromo = -1;
        $scope.selectedFilters = [];
        $scope.recentChannels = [];
        $scope.favoriteIcon = '../../images/favorite-white.png';
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = '';
        $scope.programDescription = '';
        $scope.showChannelFilter = false;
        $scope.currentChannel = {};
        $scope.tags = [];

        // for previous and next channels. These may not need to be on $scope at all.
        $scope.prevIndex = 0;
        $scope.nextIndex = 0;
        $scope.noRecentChannels = false;
        $scope.checked = false; // This will be binded using the ps-open attribute
        $scope.channelsLoaded = false;   // only show menu bar and epg if channels have loaded and information has been parsed
        $scope.checkedInfo = false; // This will be binded using the ps-open attribute
        $scope.program = {title: '', description: '', showTime: 'ShowTime ...'};

        var currentChannelIndex = {index: undefined, channelId: undefined};
        var previousChannelIndex = {index: undefined, channelId: undefined};

        activate();

        function activate() {
            $scope.timeSlots = playerSvc.getTimeSlots();
            $rootScope.$on('ChannelsLoaded', function () {
                playerSvc.getProgramming(function (err, programming) {
                    $scope.allChannels = programming;
                    $scope.programming = $scope.allChannels;
                    $scope.prevIndex = $scope.programming.length - 1;
                    mediaSvc.getFavoriteChannels(
                        function (data) {
                            $scope.favoriteChannels = playerSvc.formatFavorites(data);
                            $scope.favoriteChannels = playerSvc.mapChannels($scope.favoriteChannels, $scope.allChannels);
                            $scope.channelsLoaded = true;
                        },
                        function (error) {
                            // handle this error with toastr later?
                        }
                    );
                })
            });

            // copied and pasted from the player controller
            mediaSvc.getUserChannels(function (data) {
                $rootScope.channels = data.channels_list;
                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            });

            mediaSvc.getChannelCategories(function (data) {
                var dataCategories = data.categories;
                $rootScope.channelCategories = data.categories;
                for (var i = 0; i < dataCategories.length; i++) {
                    var genre = dataCategories[i].tags;
                    for (var j = 0; j < genre.length; j++) {
                        if (j % 2 == 0) {
                            $rootScope.channelCategories[i].tags[j].col = 0;
                        } else {
                            $rootScope.channelCategories[i].tags[j].col = 1;
                        }
                    }
                }
                $scope.tags = $rootScope.channelCategories;
            });
        }

        /**
         * "station" property in logo objects in $scope.logos corresponds to "id" in
         * filtered channel objects which becomes $scope.channelIds. this is an array
         * of only channel ids. matches up with "station" property on $scope.programming objects.
         */
        $scope.previousChannel = function () {
            $scope.watchNow($scope.prevIndex, $scope.favoriteChannels);
        };

        $scope.nextChannel = function () {
            $scope.watchNow($scope.nextIndex, $scope.favoriteChannels);
        };

        $scope.displayRecent = function () {
            var recentChannels = webStorage.session.get('recentChannels');
            if (recentChannels) {
                $scope.noRecentChannels = false;
            }
            else {
                $scope.noRecentChannels = true;
                $scope.programming = $scope.recentChannels;
                return;
            }
            $scope.recentChannels = playerSvc.mapChannels(recentChannels, $scope.allChannels);
            $scope.programming = $scope.recentChannels;
            updateNextAndPrev();
        };

        $scope.displayFavorites = function () {
            $scope.noRecentChannels = false;
            $scope.favoriteChannels.sort(function (a, b) {
                if (a.chIndex > b.chIndex) {
                    return 1;
                }
                if (a.chIndex < b.chIndex) {
                    return -1;
                }
            });
            $scope.programming = $scope.favoriteChannels;
            updateNextAndPrev();
        };

        $scope.displayAll = function () {
            $scope.noRecentChannels = false;
            $scope.programming = $scope.allChannels;
            updateNextAndPrev();
        };

        $scope.displayFiltered = function(){
            $scope.noRecentChannels = false;
            $scope.programming = $scope.filteredChannels;
            updateNextAndPrev();
        };

        // make a sure a channel is playing. taken care of by ng-hide
        // check if it's already a favorite channel. remove if it is.
        // make it a favorite channel if it's not.
        $scope.toggleFavoriteChannel = function (currentChannel) {
            var channelIndex = $scope.favoriteChannels.map(function (e) {
                return e.station;
            }).indexOf(currentChannel.channelId);
            var req;
            if (channelIndex === -1) { // check $scope.favoriteChannels to see if it's in there
                req = {channelId: currentChannel.channelId};
                mediaSvc.addFavoriteChannel(
                    req,
                    function (data) {
                        var newFavoriteId = {channelId: currentChannel.channelId};
                        var newFavoriteIndex = $scope.allChannels.map(function (e) {
                            return e.station;
                        }).indexOf(newFavoriteId.channelId);
                        var newFavoriteChannelObj = $scope.allChannels[newFavoriteIndex];
                        $scope.favoriteChannels.push(newFavoriteChannelObj);
                        $scope.favoriteIcon = '../../images/favorite-yellow.png';
                    },
                    function (error) {
                        // solve with toastr later?
                    }
                );
            } else {
                $scope.favoriteChannels.splice(channelIndex, 1);
                $scope.favoriteIcon = '../../images/favorite-white.png';
                req = {channelId: currentChannel.channelId};
                mediaSvc.removeFavoriteChannel(
                    req,
                    function (data) {
                        // solve with toastr later?
                    },
                    function (error) {
                        // solve with toastr later?
                    }
                );
            }
        };

        $scope.watchNow = function (index, favoriteChannels) {
            var favorites = favoriteChannels;

            // find the index of the channel where index === chIndex
            var indexOfClickedChannel = $scope.programming.map(function (e) {
                return e.chIndex;
            }).indexOf(index);

            setNextAndPrev(indexOfClickedChannel);

            mediaSvc.getChannelUrl($rootScope.channels[index].id).success(function (channelUrl) {
                $scope.mainUrl = channelUrl.routes[0];
                $scope.tvProgram = $rootScope.channelsEpg[index].programs;
                $scope.channelLogo = $rootScope.channels[index].logoUri;
                var programInfo = getProgramInfo(index);
                $scope.program = programInfo;
                $scope.programTitle = programInfo.title;
                $scope.programDescription = programInfo.description;
                previousChannelIndex.index = currentChannelIndex.index;
                currentChannelIndex.index = index;
                currentChannelIndex.channelId = $rootScope.channels[index].id;
                setFavoriteIcon($rootScope.channels[index].id, favorites); //check if channel is a favorite
                addRecentChannel(currentChannelIndex.channelId); //needs to be fixed to save to local storage.
                $scope.currentChannel.index = currentChannelIndex.index;
                $scope.currentChannel.channelId = $rootScope.channels[index].id;
                $rootScope.$broadcast('PlayChannel', {currentIndex: index, previousIndex: previousChannelIndex.index});
                $anchorScroll('topBox');
                if ($scope.watching === false) {
                    $timeout(function () {
                        $scope.watching = true;
                    }, 500);
                }
            });
        };

        /** Takes in the channel index id that was selected and checks if that is in the users saved favoritesChannel and
         /sets the favorite image to a yellow or white star
         */
        function setFavoriteIcon(channel, favorites) {
            var isfavorite = favorites.map(function (e) {
                return e.station;
            }).indexOf(channel);
            if (isfavorite === -1) {
                $scope.favoriteIcon = '../../images/favorite-white.png';
            } else {
                $scope.favoriteIcon = '../../images/favorite-yellow.png';
            }
        }

        function getProgramInfo(index) {
            var epgIndex = $rootScope.channelsEpg.map(function (e) {
                return e.channel_id;
            }).indexOf($rootScope.channels[index].id);
            var lineUp = [];
            var info = {title: '', description: '', showTime: 'Show Time ...'};
            var now = new Date();
            if (epgIndex >= 0) {
                lineUp = $rootScope.channelsEpg[epgIndex].programs;
                var endTime;
                if (lineUp && lineUp.length > 0) {
                    for (var i = 0; i < lineUp.length; ++i) {
                        endTime = new Date(lineUp[i].endTime);
                        if (now < endTime) {
                            info.title = lineUp[i].title;
                            info.description = lineUp[i].description;
                            info.showTime = lineUp[i].startHour + " - " + lineUp[i].endHour;
                            break;
                        }
                    }
                }
            }
            $rootScope.program = info;
            return info;
        }

        function addRecentChannel(channelId) {
            var updatedRecents, recentChannels;
            if (!webStorage.session.get('recentChannels')) {
                updatedRecents = {};
                updatedRecents[channelId] = channelId;
                webStorage.session.add('recentChannels', updatedRecents);
            } else {
                recentChannels = webStorage.session.get('recentChannels');
                if (!_.has(recentChannels, channelId)) {
                    recentChannels[channelId] = channelId;
                    webStorage.session.add('recentChannels', recentChannels);
                }
            }
        }

        // login and press prev or next (working)
        // refresh and press prev or next (working)
        // switch view and press prev or next (working)
        // when channel is clicked, update next and prev (working)
        function setNextAndPrev(indexOfClickedChannel){

            //// if prev or next is clicked and the prev or next channel doesn't exist in the current view
            if(indexOfClickedChannel === -1){
                index = $scope.programming[0].chIndex;
                indexOfClickedChannel = 0;
            }

            if (indexOfClickedChannel > 0) {
                $scope.prevIndex = $scope.programming[indexOfClickedChannel - 1].chIndex;
            }
            else if (indexOfClickedChannel === 0) {
                $scope.prevIndex = $scope.programming[$scope.programming.length - 1].chIndex;
            }
            else {
                $scope.prevIndex = $scope.programming[0].chIndex;
            }

            if (indexOfClickedChannel === ($scope.programming.length - 1)) {
                $scope.nextIndex = $scope.programming[0].chIndex;
            }
            else {
                $scope.nextIndex = $scope.programming[indexOfClickedChannel + 1].chIndex;
            }

            console.log("setNextAndPrev prevIndex, nextIndex, indexOfClickedChannel", $scope.prevIndex, $scope.nextIndex, indexOfClickedChannel)
        }


        // use this function when you want to update next and prev when a view has changed
        // case 1: the currently playing channel exists in the new view
        // case 2: it doesn't
        function updateNextAndPrev(){
            if($scope.programming.length === 0){
                return;
            }
            // find index of current channel in programming array
            var indexOfCurrent = $scope.programming.map(function (e) {
                return e.chIndex;
            }).indexOf($scope.currentChannel.index);
            // can probably shorten setNextAndPrev logic by using this modulo logic. coming back to this
            // var prev = (indexOfCurrent - 1) % ($scope.programming.length - 1);
            // var next = (indexOfCurrent + 1) % ($scope.programming.length - 1);
            // set next and prev to first and last if current channel doesn't exist in current view
            if(indexOfCurrent === -1){
                var last = $scope.programming.length - 1;
                $scope.nextIndex = $scope.programming[0].chIndex;
                $scope.prevIndex = $scope.programming[last].chIndex
                console.log("updateNextAndPrev prevIndex and nextIndex", $scope.prevIndex, $scope.nextIndex);
                return;
            }
            // reset next and prev if the current channel is found
            else{
                console.log("updateNextAndPrev found current channel in current view", $scope.currentChannel.index, indexOfCurrent);
                setNextAndPrev(indexOfCurrent)
            }
        }

        // toggles the filter open and closed
        $scope.toggle = function () {
            if($scope.selectedFilters.length === 0) {
                $scope.checked = !$scope.checked;
                $scope.allCh = "high-u";
                $scope.noRecentChannels = false;
                return
            }
            $scope.noRecentChannels = false;
            $scope.checked = !$scope.checked;
        };

        // Each of these functions checks to see if the selected filter is already in the array
        // and add it if it's not already there
        $scope.toggleFilter = function (id) {
            var filterExists = $scope.selectedFilters.indexOf(id);
            if (filterExists === -1) {
                $scope.selectedFilters.push(id);
                $scope.filteredChannels = filterChannels($scope.selectedFilters);
                $scope.programming = $scope.filteredChannels;
                updateNextAndPrev();
            } else {
                var index = $scope.selectedFilters.indexOf(id);
                $scope.selectedFilters.splice(index, 1);
                $scope.filteredChannels = filterChannels($scope.selectedFilters);
                $scope.programming = $scope.filteredChannels;
                updateNextAndPrev();
            }
        };

        $scope.clearFilters = function () {
            $scope.selectedFilters = [];
            $scope.programming = $scope.allChannels;
            for (var i = 0; i < $scope.tags.length; i++) {
                for (var j = 0; j < $scope.tags[i].tags.length; j++) {
                    $scope.tags[i].tags[j].Selected = false;
                }
            }
        };

        $scope.toggleProgramDetail = function () {
            $scope.checkedInfo = !$scope.checkedInfo;
        };

        // build filter object with category subobjects
        // loop through all channels
        // loop through all tags on a given channel
        // compare them against each category
        // add channels that have all the tags in the filter obj
        function filterChannels(filters) {
            var arr = [];
            var filterObj = {
                genre: {},
                audience: {},
                origin: {},
                language: {}
            };
            // build filters object
            for (var i = 0; i < filters.length; i++) {
                var currentFilter = parseInt(filters[i]);
                if (currentFilter <= 9) {
                    filterObj.genre[currentFilter] = currentFilter;
                }
                else if (currentFilter >= 28 && currentFilter <= 31) {
                    filterObj.audience[currentFilter] = currentFilter;
                }
                else if ((currentFilter >= 10 && currentFilter <= 18) || (currentFilter >= 20 && currentFilter <= 25) || (currentFilter >= 35 && currentFilter <= 37) || (currentFilter === 41) || (currentFilter === 45)) {
                    filterObj.origin[currentFilter] = currentFilter;
                }
                else {
                    filterObj.language[currentFilter] = currentFilter;
                }
            }
            // loop over all channel objects
            for (i = 0; i < $scope.allChannels.length; i++) {
                var channel = $scope.allChannels[i];
                // compare all the tags against each category subobject
                // if it has either in one category that should satisfy the OR
                // if it has one in each category it should satisfy the AND
                if (matchesFilters(filterObj, channel)) {
                    arr.push(channel);
                }
            }
            return arr;
        }

        function matchesFilters(filterObj, channel) {
            return (hasGenre(filterObj, channel) && hasAudience(filterObj, channel) && hasOrigin(filterObj, channel) && hasLanguage(filterObj, channel));
        }

        function hasGenre(filterObj, channel) {
            // loop over a channel's tags and see if the channel has any tag in the genre category
            // if it does, return true
            if (Object.keys(filterObj.genre).length === 0) {
                return true;
            }
            for (var i = 0; i < channel.tags.length; i++) {
                var tag = channel.tags[i];
                if (filterObj.genre.hasOwnProperty(tag)) {
                    return true;
                }
            }
        }

        function hasAudience(filterObj, channel) {
            // no audience filters selected so return true
            if (Object.keys(filterObj.audience).length === 0) {
                return true;
            }
            for (var i = 0; i < channel.tags.length; i++) {
                var tag = channel.tags[i];
                if (filterObj.audience.hasOwnProperty(tag)) {
                    return true;
                }
            }
        }

        function hasOrigin(filterObj, channel) {
            if (Object.keys(filterObj.origin).length === 0) {
                return true;
            }
            for (var i = 0; i < channel.tags.length; i++) {
                var tag = channel.tags[i];
                if (filterObj.origin.hasOwnProperty(tag)) {
                    return true;
                }
            }
        }

        function hasLanguage(filterObj, channel) {
            if (Object.keys(filterObj.language).length === 0) {
                return true;
            }
            for (var i = 0; i < channel.tags.length; i++) {
                var tag = channel.tags[i];
                if (filterObj.language.hasOwnProperty(tag)) {
                    return true;
                }
            }
        }

    }])
}(angular.module('app')));
