(function (app) {
    'use strict';

    app.controller('playerCtrl', ['_', '$', '$q', 'mediaSvc', '$scope', '$modal', '$rootScope', '$window', '$compile', '$filter', function (_, $, $q, mediaSvc, $scope, $modal, $rootScope, $window, $compile, $filter) {

        var cancellerProgram, cancellerGuide;
        $scope.selectedPromo = -1;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];

        activate();

        function activate() {
            $scope.channelList = $window.document.getElementById('channelMenuHolder');
            $scope.player = $window.document.getElementById('player');
            $scope.guide = $window.document.getElementById('userGuide');
            $scope.isVisible = false;
            $scope.closeVisible = false;

            mediaSvc.getUserChannels(function (data) {
                $rootScope.channels = data;
//                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            });

            mediaSvc.getPromos(function (data) {
                $scope.promos = data;
            });

            mediaSvc.getChannelCategories(function (data) {
                $rootScope.channelCategories = data;
            });
        }

        $scope.promoSelected = function ($index) {
            $scope.selectedPromo = $index;
            if ($index > 4) {
                $('#playerBottom').animate({scrollLeft: '+=500'}, 1000);
            }
        };

        $scope.channelClicked = function (index) {
            $scope.selectedChannel = index;
            $scope.brandImage = $scope.channels[index].logoUri;
            $scope.brandName = $scope.channels[index].title;
            $scope.isVisible = true;
            $($scope.channelList).removeClass('channel-panel');
            $($scope.channelList).addClass('channel-panel-max');
            $scope.showCloseButton();
            bringToView('#channelMenuHolder');
            getChannelGuide(index);
        };

        $scope.filteredChannelClicked = function (id) {
            var index = _.findIndex($rootScope.channels, {id: id});
            $scope.channelClicked(index);
        };

        function bringToView(selector) {
            if ($(selector).position()) {
                if ($(selector).position().top < $(window).scrollTop()) {
                    $('html,body').animate({scrollTop: $(selector).offset().top - 30}, 1500);
                } else if ($(selector).position().top + $(selector).height() > $(window).scrollTop() + (window.innerHeight || document.documentElement.clientHeight)) {
                    $('html,body').animate({scrollTop: $(selector).position().top - (window.innerHeight || document.documentElement.clientHeight) + $(selector).height() + 15}, 1500);
                }
            }
        }

        function scrollToTop() {
            var site = $('html, body');
            site.animate({
                scrollTop: $('#topBox').offset().top - 30
            }, 1500);
        }

        $scope.watchNow = function (index, rowIndex) {
            if (rowIndex === 0) {
                $scope.playChannel(index);
                scrollToTop();
            }
        };

        $scope.watchNowById = function (id) {
            var index = _.findIndex($rootScope.channels, {id: id});
            $scope.playChannel(index);
            scrollToTop();
        };

        $scope.toggleChannelFilter = function () {
            if ($rootScope.channels && $rootScope.channels.length > 0 && $rootScope.channelCategories && $rootScope.channelCategories.length > 0) {
                addTagsToChannels();
                $scope.filteredChannels = $rootScope.channels;
                $scope.clearAll();
                $scope.showChannelFilter = !$scope.showChannelFilter;
            }
        };

        function addTagsToChannels() {
            var genres = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Genre'}), 'tags'), 'id');
            var languages = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Language'}), 'tags'), 'id');
            var regions = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Region'}), 'tags'), 'id');
            var audiences = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Audience'}), 'tags'), 'id');
            for (var i = 0; i < $rootScope.channels.length; i++) {
                for (var j = 0; j < $rootScope.channels[i].tags_ids.length; j++) {
                    if (_.indexOf(genres, $rootScope.channels[i].tags_ids[j]) > -1) {
                        $rootScope.channels[i].genre = $rootScope.channels[i].tags_ids[j];
                    } else if (_.indexOf(regions, $rootScope.channels[i].tags_ids[j]) > -1) {
                        $rootScope.channels[i].region = $rootScope.channels[i].tags_ids[j];
                    } else if (_.indexOf(audiences, $rootScope.channels[i].tags_ids[j]) > -1) {
                        $rootScope.channels[i].audience = $rootScope.channels[i].tags_ids[j];
                    } else if (_.indexOf(languages, $rootScope.channels[i].tags_ids[j]) > -1) {
                        $rootScope.channels[i].language = $rootScope.channels[i].tags_ids[j];
                    }
                }
            }
        }

        $scope.showCloseButton = function () {
            if (angular.element('#closeBtn').length) {
                $scope.closeVisible = true;
                $scope.logoVisible = true;
            } else {
                var previewPanel = angular.element('#channelMenuHolder');
                var closePanel = angular.element(document.createElement('close-panel'));
                var channelLogo = angular.element(document.createElement('channel-logo'));
                $compile(channelLogo)($scope);
                $compile(closePanel)($scope);
                angular.element(previewPanel).append(closePanel).append(channelLogo);
            }
        };

        $scope.hideCloseButton = function () {
            $scope.isVisible = false;
            $scope.closeVisible = false;
            $scope.logoVisible = false;
        };

        $scope.channelHovered = function (index) {
            $scope.hoveredChannel = index;
            getFirstProgram(index);
        };

        function getFirstProgram(index) {
            if (cancellerProgram) {
                cancellerProgram.resolve();
            }
            cancellerProgram = $q.defer();
            $scope.programDetails = null;
            if (index > -1) {
                mediaSvc.getChannelGuide($scope.channels[index].id, 1, cancellerProgram).success(function (programs) {
                    $scope.programDetails = getProgramDetails(programs[0]);
                });
            }
        }

        function getChannelGuide(index) {
            if (cancellerGuide) {
                cancellerGuide.resolve();
            }
            cancellerGuide = $q.defer();
            $scope.showListings = [];
            $scope.loadingProgramGuide = true;
            mediaSvc.getChannelGuide($scope.channels[index].id, 12, cancellerGuide).success(function (programs) {
                var showTimes = programs;
                if (showTimes.length > 0) {
                    $scope.programDetails = getProgramDetails(showTimes[0]);
                    for (var i = 0; i < showTimes.length; i++) {
                        $scope.showListings[i] = getChannelDetails(showTimes[i]);
                    }
                } else {
                    $scope.programDetails = getProgramDetails();
                    $scope.showListings[0] = getChannelDetails();
                }
                $scope.loadingProgramGuide = false;
            });
        }

        $scope.playChannel = function (index, airing) {
            mediaSvc.getChannelUrl($rootScope.channels[index].id).success(function (channelUrl) {
                $scope.tvUrl = channelUrl.routes[0];
                $scope.airing = airing;
                $scope.channelLogo = $scope.channels[index].logoUri;
                $scope.channelName = $scope.channels[index].title;
                playStream();
            });
        };

        function playStream() {
            jwplayer('yiptv-player').setup({
                width: '100%',
                height: 360,
                file: $scope.tvUrl,
                image: $scope.channelLogo,
                primary: 'flash',
                autostart: true,
                fallback: true,
                androidhls: true,
                type: 'hls'
            });
        }

        function getTime(index, airing) {
            if (index === 0) {
                return $filter('translate')('PLAYER_ON_NOW');
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return (startTime.getHours() % 12 ? startTime.getHours() % 12 : 12) + ':' + pad(startTime.getMinutes()) + ' ' + (startTime.getHours() >= 12 ? 'PM' : 'AM' ) + ' - ' + (endTime.getHours() % 12 ? endTime.getHours() % 12 : 12) + ':' + pad(endTime.getMinutes()) + ' ' + (endTime.getHours() >= 12 ? 'PM' : 'AM');
        }

        function pad(number) {
            var value = String(number);
            if (value.length === 1) {
                value = '0' + value;
            }
            return value;
        }

        function getImage(uri) {
            if (!uri) {
                return '/images/empty.png';
            } else if (uri.indexOf('/images/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        }

        $scope.favoriteChannelSelected = function ($index) {
            $scope.selectedFavoriteChannel = $index;
        };

        function getProgramDetails(airing) {
            var programDetails;
            if (airing) {
                if (!airing.title) {
                    programDetails = '<p style="text-align: left;"><span class="program-details-header" translate="PLAYER_ON_NOW"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    programDetails = '<p style="text-align: left;"><span class="program-details-header" translate="PLAYER_ON_NOW"></span><span class="program-details-body">' + airing.title + '</span></p>';
                }
                if (!airing.endTime && !airing.startTime) {
                    programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body">' + getTime(1, airing) + '</span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body">' + getDuration(airing.startTime, airing.endTime) + '</span>&nbsp;<span class="program-details-body" translate="PLAYER_MINUTES"></span></p>';
                }
                if (!airing.description) {
                    programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    programDetails += '<p style="text-align: left;word-break: break-all;white-space: normal"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body">' + airing.description + '</span></p>';
                }
            } else {
                programDetails = '<p style="text-align: left;"><span class="program-details-header" translate="PLAYER_ON_NOW"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
            }
            return programDetails;
        }

        function getChannelDetails(show) {
            var channelDetails;
            if (show) {
                if (!show.title) {
                    channelDetails = '<div><img class="hidden-xs" src="' + getImage(show.image) + '" /><p style="text-align: left;"><span class="program-details-header" translate="PLAYER_TITLE"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    channelDetails = '<div><img class="hidden-xs" src="' + getImage(show.image) + '" /><p style="text-align: left;"><span class="program-details-header" translate="PLAYER_TITLE"></span><span class="program-details-body">' + show.title + '</span></p>';
                }
                channelDetails = '<div><img class="hidden-xs" src="' + getImage(show.image) + '" /><p style="text-align: left;"><span class="program-details-header" translate="PLAYER_TITLE"></span><span class="program-details-body">' + (show.title ? show.title : $filter('translate')('PLAYER_NOT_AVAILABLE')) + '</span></p>';
                if (!show.endTime && !show.startTime) {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header"translate="PLAYER_DURATION"></span><span class="program-details-body"translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body">' + getTime(1, show) + '</span></p><p><span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body">' + getDuration(show.startTime, show.endTime) + '</span>&nbsp;<span  class="program-details-body" translate="PLAYER_MINUTES"></span></p>';
                }
                if (!show.description) {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                } else {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body">' + show.description + '</span></p></div>';
                }
            } else {
                channelDetails = '<div><p style="text-align: left;"><span class="program-details-header" translate="PLAYER_TITLE"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
            }
            return channelDetails;
        }

        $scope.getTags = function (category) {
            return _.result(_.find($rootScope.channelCategories, {name: category}), 'tags');
        };

        $scope.clearAll = function () {
            $scope.selectedGenres = [];
            $scope.selectedRegions = [];
            $scope.selectedAudiences = [];
            $scope.selectedLanguages = [];
            filterChannels();
        };

        function getDuration(startTime, endTime) {
            return Math.floor((new Date(endTime) - new Date(startTime)) / 1000 / 60);
        }

        function filterChannels() {
            $scope.filteredChannels = $rootScope.channels;
            if ($scope.selectedGenres.length > 0) {
                $scope.filteredChannels = _.filter($scope.filteredChannels, function (item) {
                    return _.contains($scope.selectedGenres, item.genre);
                });
            }
            if ($scope.selectedRegions.length > 0) {
                $scope.filteredChannels = _.filter($scope.filteredChannels, function (item) {
                    return _.contains($scope.selectedRegions, item.region);
                });
            }
            if ($scope.selectedAudiences.length > 0) {
                $scope.filteredChannels = _.filter($scope.filteredChannels, function (item) {
                    return _.contains($scope.selectedAudiences, item.audience);
                });
            }
            if ($scope.selectedLanguages.length > 0) {
                $scope.filteredChannels = _.filter($scope.filteredChannels, function (item) {
                    return _.contains($scope.selectedLanguages, item.language);
                });
            }
        }

        $scope.toggleGenreSelection = function (tag) {
            var index = $scope.selectedGenres.indexOf(tag);
            if (index > -1) {
                $scope.selectedGenres.splice(index, 1);
            } else {
                $scope.selectedGenres.push(tag);
            }
            filterChannels();
        };

        $scope.toggleRegionSelection = function (tag) {
            var index = $scope.selectedRegions.indexOf(tag);
            if (index > -1) {
                $scope.selectedRegions.splice(index, 1);
            } else {
                $scope.selectedRegions.push(tag);
            }
            filterChannels();
        };

        $scope.toggleAudienceSelection = function (tag) {
            var index = $scope.selectedAudiences.indexOf(tag);
            if (index > -1) {
                $scope.selectedAudiences.splice(index, 1);
            } else {
                $scope.selectedAudiences.push(tag);
            }
            filterChannels();
        };

        $scope.toggleLanguageSelection = function (tag) {
            var index = $scope.selectedLanguages.indexOf(tag);
            if (index > -1) {
                $scope.selectedLanguages.splice(index, 1);
            } else {
                $scope.selectedLanguages.push(tag);
            }
            filterChannels();
        };
    }]);
}(angular.module('app')));
