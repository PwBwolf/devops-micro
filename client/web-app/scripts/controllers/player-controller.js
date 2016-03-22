(function (app) {
    'use strict';

    app.controller('playerCtrl', ['$scope', '$rootScope', 'mediaSvc', '$filter', '$cookies', 'playerSvc', '$location', '$anchorScroll', function ($scope, $rootScope, mediaSvc, $filter, $cookies, playerSvc, $location, $anchorScroll) {
        // epg related variables
        $scope.programming = [];
        $scope.favoriteChannels = [];
        $scope.recentChannels = [];
        $scope.allChannels = [];
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
        var displayingAll = true;
        var displayingFavorites = false;
        var displayingRecents = false;
        var currentChannelIndex = {index: undefined, channelId: undefined};
        var previousChannelIndex = {index: undefined, channelId: undefined};

        activate();

        function activate() {
            $scope.timeSlots = playerSvc.getTimeSlots();
            $rootScope.$on('ChannelsLoaded', function () {
                playerSvc.getProgramming(function (err, programming) {
                    $scope.allChannels = programming;
                    $scope.programming = $scope.allChannels;
                    mediaSvc.getFavoriteChannels(
                        function (data) {
                            $scope.favoriteChannels = playerSvc.formatFavorites(data);
                            $scope.favoriteChannels = playerSvc.mapChannels($scope.favoriteChannels, $scope.allChannels);
                        },
                        function (error) {
                            // handle this error with toastr later?
                        }
                    );
                })
            });

            $scope.$on('ChannelFilterEvent', function (event, args) {
                updateChannelGuide($rootScope.filteredChannels);
            });

            // copied and pasted from the player controller
            mediaSvc.getUserChannels(function (data) {
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
            displayingRecents = true;
            displayingFavorites = false;
            displayingAll = false;
            var recentPrograms = $cookies.recent;
            if (recentPrograms) {
                var recentCookies = JSON.parse(recentPrograms);
                $scope.noRecentChannels = false;
            }
            else {
                $scope.noRecentChannels = true;
                $scope.programming = $scope.recentChannels;
                return;
            }
            $scope.recentChannels = playerSvc.mapChannels(recentCookies, $scope.allChannels);
            $scope.recentChannels.sort(function (a, b) {
                if (a.chIndex > b.chIndex) {
                    return 1;
                }
                if (a.chIndex < b.chIndex) {
                    return -1;
                }
            });
            $scope.programming = $scope.recentChannels;
        };

        $scope.displayFavorites = function () {
            displayingFavorites = true;
            displayingAll = false;
            displayingRecents = false;
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
        };

        $scope.displayAll = function () {
            displayingAll = true;
            displayingFavorites = false;
            displayingRecents = false;
            $scope.noRecentChannels = false;
            $scope.programming = $scope.allChannels;
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
                            return e.station
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
            if ($scope.watching === false) {
                $scope.watching = true;
            }
            // find the index of the channel where index === chIndex
            var indexOfClickedChannel = $scope.programming.map(function (e) {
                return e.chIndex
            }).indexOf(index);
            if (indexOfClickedChannel > 0) {
                $scope.prevIndex = $scope.programming[indexOfClickedChannel - 1].chIndex;
            } else if (indexOfClickedChannel === 0) {
                $scope.prevIndex = $scope.programming[$scope.programming.length - 1].chIndex;
            } else {
                $scope.prevIndex = $scope.programming[0].chIndex;
            }
            if (indexOfClickedChannel === ($scope.programming.length - 1)) {
                $scope.nextIndex = 0;
            } else {
                $scope.nextIndex = $scope.programming[indexOfClickedChannel + 1].chIndex;
            }

            mediaSvc.getChannelUrl($rootScope.channels[index].id).success(function (channelUrl) {
                $scope.mainUrl = channelUrl.routes[0];
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
                $scope.currentChannel.index = currentChannelIndex.index;
                $scope.currentChannel.channelId = $rootScope.channels[index].id;
                $rootScope.$broadcast('PlayChannel', {currentIndex: index, previousIndex: previousChannelIndex.index});
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash('topBox');
                $anchorScroll();
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
            var updatedRecents, recentCookies;
            if ($cookies.recent === undefined) {
                updatedRecents = {};
                updatedRecents[channelId] = channelId;
                $cookies.recent = JSON.stringify(updatedRecents);
                recentCookies = $cookies.recent;
            } else {
                var matchFound = false;
                recentCookies = $cookies.recent;
                recentCookies = JSON.parse(recentCookies);
                for (var i in recentCookies) {
                    if (recentCookies.hasOwnProperty(i)) {
                        if (channelId === i) {
                            matchFound = true;
                        }
                    }
                }
                if (!matchFound) {
                    recentCookies[channelId] = channelId;
                    updatedRecents = JSON.stringify(recentCookies);
                    $cookies.recent = updatedRecents;
                }
            }
        }

        $scope.toggle = function () {
            $scope.checked = !$scope.checked;
            if ($scope.checked) {
                $scope.$emit('ToggleChannelFilterEvent');
            }
        };

        // Each of these functions checks to see if the selected filter is already in the array
        // and add it if it's not already there
        $scope.toggleFilter = function (id) {
            var filterExists = $scope.selectedFilters.indexOf(id);
            if (filterExists === -1) {
                $scope.selectedFilters.push(id);
                $scope.programming = filterChannels($scope.selectedFilters);
            } else {
                var index = $scope.selectedFilters.indexOf(id);
                $scope.selectedFilters.splice(index, 1);
                $scope.programming = filterChannels($scope.selectedFilters);
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

        // loop through all channels
        // loop through all tags on a given channel
        // add channels that have all the tags in the filter obj
        function filterChannels(filters) {
            var arr = [];
            var filterObj = {};
            // build filters object
            for (var i = 0; i < filters.length; i++) {
                var currentFilter = filters[i];
                filterObj[currentFilter] = currentFilter;
            }
            for (i = 0; i < $scope.allChannels.length; i++) {
                var matches = 0;
                for (var j = 0; j < $scope.allChannels[i].tags.length; j++) {
                    var tag = $scope.allChannels[i].tags[j];
                    if (filterObj.hasOwnProperty(tag)) {
                        matches++;
                    }
                    if ((j === $scope.allChannels[i].tags.length - 1) && (matches === Object.keys(filterObj).length)) {
                        var currentChannel = $scope.allChannels[i];
                        arr.push(currentChannel);
                    }
                }
            }
            return arr;
        }
    }])
}(angular.module('app')));
