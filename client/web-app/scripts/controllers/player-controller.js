(function (app) {
    'use strict';

    app.controller('playerCtrl', ['$scope', '$rootScope', 'userSvc', 'mediaSvc', '$filter', 'playerSvc', '$anchorScroll', '$timeout', 'webStorage', '$interval', function ($scope, $rootScope, userSvc, mediaSvc, $filter, playerSvc, $anchorScroll, $timeout, webStorage, $interval) {
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
        $scope.favoriteIcon = '../../images/favorite-purple.png';
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = '';
        $scope.programDescription = '';
        $scope.showChannelFilter = false;
        $scope.tags = [];
        $scope.currentView = 'all';

        // for previous and next channels. These may not need to be on $scope at all.
        $scope.prevIndex = 0;
        $scope.nextIndex = 0;
        $scope.noRecentChannels = false;
        $scope.noFavoriteChannels = false;
        $scope.noFiltered = false;
        $scope.checked = false;                         // This will be binded using the ps-open attribute
        $scope.channelsLoaded = false;                  // only show menu bar and epg if channels have loaded and information has been parsed
        $scope.checkedInfo = false;                     // This will be binded using the ps-open attribute
        $scope.program = {title: '', description: '', showTime: 'ShowTime ...'};
        $scope.hasTitle = false;

        // scope variables for setting css on view changes
        $scope.favCh = "";
        $scope.recCh = "";
        $scope.allCh = "high-u";
        $scope.filtCh = "";

        var displayingRecents = false;
        var currentView = 'all';

        activate();

        function activate() {
            $scope.timeSlots = playerSvc.getTimeSlots();
            getChannels();
            initProgrammingGuide();
            getChannelCategories();
        }

        // get Channels for this user
        function getChannels() {
            mediaSvc.getUserChannels(function (data) {
                $rootScope.channels = data.channels_list;
                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            }, function (err) {
                // show error
            });
        }

        // Get programming guide info for this user and initialize autorefresh
        function initProgrammingGuide() {
            $rootScope.$on('ChannelsLoaded', function () {
                getProgramming();
                autoRefresh();
            });
        }

        // This is for layout of filter categories copied from old epg
        // leaving it instead of redoing logic here and in filter.html page
        function getChannelCategories() {
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
            }, function (err) {
                // show error
            });
        }

        // get epg programming / favorite channels for user and initialize all channels view
        function getProgramming() {
            playerSvc.getProgramming(function (err, programming) {
                $scope.allChannels = programming;
                $scope.programming = $scope.allChannels.slice(0, 10);
                currentView = 'all';
                userSvc.getFavoriteChannels(
                    function (data) {
                        $scope.favoriteChannels = data;
                        $scope.favoriteChannels = playerSvc.mapChannels($scope.favoriteChannels);
                        $scope.channelsLoaded = true;
                        setCSS();
                    },
                    function (error) {
                        // handle this error with toastr later?
                    }
                );
            })
        }

        // refresh epg programming and allChannels object
        function refreshProgramming() {
            playerSvc.getProgramming(function (err, programming) {
                $scope.allChannels = programming;
                refreshView();
            })
        }

        // map the views against new allChannels object to update lineUps
        // will refresh the epg in place regardless of view or current scroll position
        function refreshView() {
            $scope.programming = mapLineups($scope.programming);
            $scope.favoriteChannels = mapLineups($scope.favoriteChannels);
            $scope.recentChannels = mapLineups($scope.recentChannels);
            $scope.filteredChannels = mapLineups($scope.filteredChannels);
        }

        // replace current lineUps on each channel obj with fresh lineUps
        function mapLineups(arr) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].lineUp = playerSvc.allChannelsObj[arr[i].id].lineUp;
            }
            return arr;
        }

        $scope.refresh = function () {
            $scope.channelsLoaded = false;
            getProgramming();
            clearErrMessages();
        };

        // refresh timebar and epg on next half and quarter hour respectively
        // automatically refresh timebar and epg every 30 and 15 minutes after that
        function autoRefresh() {
            var lastHalf = lastXHour(30);
            var lastQuarter = lastXHour(15);
            var nextQuarter = lastQuarter + (1000 * 60 * 16);
            var nextHalf = lastHalf + (1000 * 60 * 31);
            var currentTime = new Date();
            var quarterInterval = nextQuarter - currentTime.getTime();
            var halfInterval = nextHalf - currentTime.getTime();
            var fifteenMin = 1000 * 60 * 15;
            var thirtyMin = 1000 * 60 * 30;

            // refresh on the quarter hour after they log in
            // refresh every 15 minutes after that
            $timeout(function () {
                refreshProgramming();
                $interval(function () {
                    refreshProgramming();
                }, fifteenMin);
            }, quarterInterval);

            $timeout(function () {
                $scope.timeSlots = playerSvc.getTimeSlots();
                $interval(function () {
                    $scope.timeSlots = playerSvc.getTimeSlots();
                }, thirtyMin)
            }, halfInterval);
        }

        // return the most recent x (quarter, half, etc...) hour in unix time
        function lastXHour(x) {
            var currentTime = new Date();
            var lastX = Math.floor(currentTime.getTime() / (1000 * 60 * x)); // get unix time in half hours rounded down to last half hour
            lastX = lastX * 1000 * 60 * x; // get last half hour in ms again
            return lastX;
        }

        // probably a more elegant way to do this, but we have a release deadline.
        $scope.loadMore = function () {
            if (currentView === 'all') {
                loadMore($scope.allChannels);
            }
            else if (currentView === 'recents') {
                loadMore($scope.recentChannels);
            }
            else if (currentView === 'favorites') {
                loadMore($scope.favoriteChannels);
            }
            else if (currentView === 'filtered') {
                loadMore($scope.filteredChannels);
            }
        };

        function loadMore(channelsArr) {
            for (var i = 0; i < 10; i++) {
                var checkLength = ($scope.programming.length) < channelsArr.length;
                if (checkLength) {
                    var channel = channelsArr[$scope.programming.length];
                    $scope.programming.push(channel);
                }
            }
        }

        $scope.displayAll = function () {
            currentView = 'all';
            clearErrMessages();
            $scope.programming = $scope.allChannels.slice(0, 10);
            setCSS();
        };

        $scope.displayRecent = function () {
            clearErrMessages();
            currentView = 'recents';
            var recentChannels = webStorage.session.get('recentChannels');
            displayingRecents = true;

            // recent channels exist, else they don't
            if (recentChannels) {
                $scope.noRecentChannels = false;
            }
            else {
                $scope.noRecentChannels = true;
                $scope.programming = $scope.recentChannels;
                setCSS();
                return;
            }
            $scope.recentChannels = playerSvc.mapChannels(recentChannels);
            $scope.programming = $scope.recentChannels.slice(0, 10);
            setCSS();
        };

        $scope.displayFavorites = function () {
            clearErrMessages();
            currentView = 'favorites';
            if ($scope.favoriteChannels.length === 0) {
                $scope.programming = $scope.favoriteChannels;
                $scope.noFavoriteChannels = true;
                setCSS();
                return
            }
            var sortedFavorites = sortChannels($scope.favoriteChannels);
            $scope.programming = sortedFavorites.slice(0, 10);
            setCSS();
        };

        function sortChannels(arr) {
            arr.sort(function (a, b) {
                if (a.chIndex > b.chIndex) {
                    return 1;
                }
                if (a.chIndex < b.chIndex) {
                    return -1;
                }
            });
            return arr;
        }

        $scope.displayFiltered = function () {
            currentView = 'filtered';
            clearErrMessages();
            // no filtered channels
            if ($scope.filteredChannels.length === 0) {
                $scope.noFiltered = true;
                $scope.programming = $scope.filteredChannels;
                setCSS();
                return;
            }
            else {
                $scope.programming = $scope.filteredChannels.slice(0, 10);
            }
            setCSS();
        };

        // clear error messages like "no favorites", "no filtered" etc...
        function clearErrMessages() {
            $scope.noRecentChannels = false;
            $scope.noFavoriteChannels = false;
            $scope.noFiltered = false;
        }

        // make a sure a channel is playing. taken care of by ng-hide
        // check if it's already a favorite channel. remove if it is.
        // make it a favorite channel if it's not.
        $scope.toggleFavoriteChannel = function (currentChannel) {
            var channelIndex = $scope.favoriteChannels.map(function (e) {
                return e.id;
            }).indexOf(currentChannel.channelId);
            // add the channel to favorite channels if it's not already there
            if (channelIndex === -1) { // check $scope.favoriteChannels to see if it's in there
                addFavorite(currentChannel);
            }
            // remove the channel if it's already in favorites
            else {
                removeFavorite(currentChannel, channelIndex);
            }
        };

        function addFavorite(currentChannel) {
            userSvc.addFavoriteChannel(
                currentChannel,
                function () {
                    var newFavoriteChannelObj = playerSvc.allChannelsObj[currentChannel.channelId];
                    $scope.favoriteChannels.push(newFavoriteChannelObj);
                    $scope.favoriteIcon = '../../images/favorite-yellow.png';
                    $scope.noFavoriteChannels = false;
                    if (currentView === 'favorites') {
                        $scope.programming = sortChannels($scope.favoriteChannels).slice(0, 10);
                    }
                },
                function (error) {
                    // solve with toastr later?
                }
            );
        }

        function removeFavorite(currentChannel, channelIndex) {
            $scope.favoriteChannels.splice(channelIndex, 1);
            if (currentView === 'favorites') {
                $scope.programming = $scope.favoriteChannels.slice(0, 10);
                if ($scope.favoriteChannels.length === 0) {
                    $scope.noFavoriteChannels = true;
                }
            }
            $scope.favoriteIcon = '../../images/favorite-purple.png';
            userSvc.removeFavoriteChannel(
                currentChannel.channelId,
                function (data) {

                },
                function (error) {
                    // solve with toastr later?
                }
            );
        }

        $scope.watchNow = function (id) {
            mediaSvc.getChannelUrl(id).success(function (channelUrl) {
                // set URLs for channel and channel logo
                $scope.mainUrl = channelUrl.routes[0];
                $scope.channelLogo = playerSvc.allChannelsObj[id].logo;

                // set program info for display in epg
                var programInfo = getProgramInfo(id);
                $scope.programTitle = programInfo.title;
                $scope.programDescription = programInfo.description || false;
                $scope.currentChannel.channelId = id;

                // set favorite icon (if needed) and add this channel to recent channels list
                setFavoriteIcon($scope.currentChannel.channelId); //check if channel is a favorite
                addRecentChannel($scope.currentChannel.channelId);

                // scroll user back to player window
                $anchorScroll('topBox');

                // have delay to avoid user seeing error message while jwplayer connects to video source
                if ($scope.watching === false) {
                    $timeout(function () {
                        $scope.watching = true;
                    }, 500);
                }

                // move this channel to top of epg if in the 'recents' view
                if (currentView === 'recents') {

                    // find the index of the channel in the current programming array
                    var indexOfClickedChannel = $scope.programming.map(function (e) {
                        return e.id;
                    }).indexOf(id);

                    channelToTop(indexOfClickedChannel);
                }
            });

        };

        // set / unset favorite icon
        function setFavoriteIcon(channelId) {
            var isfavorite = $scope.favoriteChannels.map(function (e) {
                return e.id;
            }).indexOf(channelId);
            if (isfavorite === -1) {
                $scope.favoriteIcon = '../../images/favorite-purple.png';
            } else {
                $scope.favoriteIcon = '../../images/favorite-yellow.png';
            }
        }

        function getProgramInfo(id) {
            var info = {title: '', description: '', showTime: 'Show Time ...'};
            var now = new Date();
            var lineUp = playerSvc.channelsEpgObj[id];
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
            return info;
        }

        function addRecentChannel(channelId) {
            var updatedRecents, recentChannels;
            if (!webStorage.session.get('recentChannels')) {
                updatedRecents = [];
                updatedRecents[0] = channelId;
                webStorage.session.set('recentChannels', updatedRecents);
            } else {
                recentChannels = webStorage.session.get('recentChannels');
                var index = recentChannels.indexOf(channelId);
                if (index === -1) {
                    recentChannels.unshift(channelId);
                    webStorage.session.set('recentChannels', recentChannels);
                }
                else {
                    var mostRecent = recentChannels.splice(index, 1);
                    recentChannels.unshift(mostRecent[0]);
                    webStorage.session.set('recentChannels', recentChannels);
                }
            }
        }

        // make this channel the first one in the epg so the most recently viewed is at the top in the "Recent" channel view
        function channelToTop(indexOfClickedChannel) {
            var mostRecent = $scope.programming.splice(indexOfClickedChannel, 1)[0];
            $scope.programming.unshift(mostRecent);
        }

        // toggles the filter open and closed
        $scope.toggle = function () {
            $scope.checked = !$scope.checked;
        };

        // Each of these functions checks to see if the selected filter is already in the array
        // and add it if it's not already there
        $scope.toggleFilter = function (id) {
            clearErrMessages();
            if (currentView !== "filtered") {
                currentView = 'filtered';
                setCSS();
            }
            var filterIndex = $scope.selectedFilters.indexOf(id);
            if (filterIndex === -1) {
                filterOn(id);
            } else {
                filterOff(filterIndex);
                if ($scope.selectedFilters.length === 0) {
                    currentView = 'all';
                    setCSS();
                }
            }
        };

        function filterOn(id) {
            $scope.selectedFilters.push(id);
            $scope.filteredChannels = filterChannels($scope.selectedFilters);
            $scope.programming = $scope.filteredChannels.slice(0, 10);
            noFiltered();
        }

        function filterOff(filterIndex) {
            $scope.selectedFilters.splice(filterIndex, 1);
            $scope.filteredChannels = filterChannels($scope.selectedFilters);
            $scope.programming = $scope.filteredChannels.slice(0, 10);
            noFiltered();
        }

        // sets / unsets the noFiltered variable
        function noFiltered() {
            if ($scope.selectedFilters.length === 0) {
                $scope.programming = $scope.allChannels.slice(0, 10);
                return;
            }
            if ($scope.filteredChannels.length === 0) {
                $scope.noFiltered = true;
                return;
            }
            else {
                $scope.noFiltered = false;
            }
        }

        $scope.clearFilters = function () {
            clearErrMessages();
            $scope.selectedFilters = [];
            $scope.filteredChannels = [];
            $scope.programming = $scope.allChannels.slice(0, 10);
            currentView = 'all';
            uncheckFilters();
            $scope.noFiltered = false;
            setCSS();
        };

        // uncheck check boxes in the filter
        function uncheckFilters() {
            for (var i = 0; i < $scope.tags.length; i++) {
                for (var j = 0; j < $scope.tags[i].tags.length; j++) {
                    $scope.tags[i].tags[j].Selected = false;
                }
            }
        }

        // build filter object with category subobjects, loop through all channels, loop through all tags on a given channel, compare them against each category
        function filterChannels(filters) {
            var arr = [];
            var filterObj = buildFilterObj(filters);
            var noFilter = emptyFilter(filterObj);
            if (noFilter) {
                return arr;
            }
            for (var i = 0; i < $scope.allChannels.length; i++) {
                var channel = $scope.allChannels[i];
                if (matchesFilters(filterObj, channel)) {
                    arr.push(channel);
                }
            }
            return arr;
        }

        function buildFilterObj(filters) {
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
                else if ((currentFilter >= 29 && currentFilter <= 31) || (currentFilter >= 55 && currentFilter <=58)) {
                    filterObj.audience[currentFilter] = currentFilter;
                }
                else if (currentFilter === 12 || currentFilter === 23 || currentFilter === 47 || currentFilter === 48 || currentFilter === 50 || currentFilter === 53 || currentFilter === 54) {
                    filterObj.origin[currentFilter] = currentFilter;
                }
                else {
                    filterObj.language[currentFilter] = currentFilter;
                }
            }
            return filterObj;
        }

        function emptyFilter() {
            return $scope.selectedFilters.length === 0;
        }

        // compare all the tags against each category subobject
        // It is an OR within the same category and an AND between different categories
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

        // set css to show the currently selected EPG view
        function setCSS() {
            clearCSS();
            if (currentView === "favorites") {
                $scope.favCh = 'my-class';
            }
            else if (currentView === "recents") {
                $scope.recCh = 'my-class';
            }
            else if (currentView === "all") {
                $scope.allCh = 'high-u';
            }
            else {
                $scope.filtCh = 'my-class';
            }
        }

        //
        function clearCSS() {
            $scope.favCh = '';
            $scope.recCh = '';
            $scope.allCh = 'no-u';
            $scope.filtCh = '';
        }

    }])
}(angular.module('app')));
