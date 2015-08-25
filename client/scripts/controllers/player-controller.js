(function (app) {
    'use strict';

    app.controller('playerCtrl', ['_', 'mediaSvc', '$scope', '$modal', '$rootScope', '$window', '$compile', '$filter', function (_, mediaSvc, $scope, $modal, $rootScope, $window, $compile, $filter) {


        $scope.selectedPromoChannel = -1;
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
                $rootScope.$broadcast('ChannelsLoaded');
            });

            mediaSvc.getPromoChannels(function (data) {
                $scope.promoChannels = data;
            });

            mediaSvc.getChannelCategories(function (data) {
                $rootScope.channelCategories = data.categories;
            });
        }

        $scope.promoChannelSelected = function ($index) {
            $scope.selectedPromoChannel = $index;
        };

        $scope.channelClicked = function (index) {
            $scope.selectedChannel = index;
            $scope.brandImage = $scope.channels[index].image_url;
            $scope.isVisible = true;
            $($scope.channelList).removeClass('channel-panel');
            $($scope.channelList).addClass('channel-panel-max');
            $scope.showCloseButton();
            getChannelGuide(index);
        };

        $scope.filteredChannelClicked = function (index) {
            $scope.selectedChannel = index;
            $scope.brandImage = $scope.filteredChannels[index].image_url;
            $scope.isVisible = true;
            $($scope.channelList).removeClass('channel-panel');
            $($scope.channelList).addClass('channel-panel-max');
            $scope.showCloseButton();
            getFilteredChannelGuide(index);
        };

        $scope.watchNow = function (index, play) {
            if (index !== null && index !== undefined && index > -1) {
                $scope.playChannel(index);
            } else if (play === 0) {
                $scope.playChannel($scope.selectedChannel);
            }
        };

        $scope.toggleChannelFilter = function () {
            $scope.filteredChannels = $rootScope.channels;
            $scope.showChannelFilter = !$scope.showChannelFilter;
        };

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
            $scope.programDetails = null;
            if (!$scope.loadingChannelGuide && index > -1) {
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[index].live_external_id, 12).success(function (channelGuide) {
                    $scope.programDetails = $scope.getProgramDetails(channelGuide[0].airings[0]);
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                });
            }
        }

        function getChannelGuide(index) {
            mediaSvc.getChannelGuide($scope.channels[index].live_external_id, 12).success(function (channelGuide) {
                $scope.showTimes = channelGuide[0].airings;
                $scope.programDetails = $scope.getProgramDetails(channelGuide[0].airings[0]);
                $scope.showListings = [];
                for (var i = 0; i < $scope.showTimes.length; i++) {
                    $scope.showListings[i] = $scope.getChannelDetails($scope.showTimes[i]);
                }
            });
        }

        function getFilteredChannelGuide(index) {
            mediaSvc.getChannelGuide($scope.filteredChannels[index].live_external_id, 12).success(function (channelGuide) {
                $scope.showTimes = channelGuide[0].airings;
                $scope.programDetails = $scope.getProgramDetails(channelGuide[0].airings[0]);
                $scope.showListings = [];
                for (var i = 0; i < $scope.showTimes.length; i++) {
                    $scope.showListings[i] = $scope.getChannelDetails($scope.showTimes[i]);
                }
            });
        }

        $scope.playChannel = function (index, airing) {
            mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                $scope.tvUrl = channel.live_pc_url;
                $scope.airing = airing;
                $scope.channelLogo = $scope.channels[index].image_url;
                $scope.channelNumber = $scope.channels[index].number;
                $scope.channelName = $scope.channels[index].name;
                playStream();
            });
        };

        function playStream() {
            jwplayer('yiptv-player').setup({
                width: '100%',
                height: 370,
                playlist: [{
                    image: $scope.channelLogo,
                    sources: [
                        {file: $scope.tvUrl}
                    ]
                }],
                modes: [
                    {type: 'html5'},
                    {type: 'flash', src: 'scripts/external/jwplayer.flash.swf'}
                ],
                rtmp: {
                    bufferlength: 3
                },
                primary: 'html5',
                autostart: true,
                fallback: true
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

        $scope.getImage = function (uri) {
            if (uri.indexOf('/images/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        };

        $scope.favoriteChannelSelected = function ($index) {
            $scope.selectedFavoriteChannel = $index;
        };

        $scope.getProgramDetails = function (airing) {
            var programDetails = '<p style="text-align: left;"><span class="program-details-header" translate="PLAYER_ON_NOW"></span><span class="program-details-body">' + airing.program.title + '</span></p>';
            if (!airing.duration && !airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
            } else {
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body">' + getTime(1, airing) + '</span>&nbsp;<span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body">' + airing.duration + '</span>&nbsp;<span class="program-details-body" translate="PLAYER_MINUTES"></span></p>';
            }
            if (!airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
            } else {
                programDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body">' + airing.program.shortDescription + '</span></p>';
            }
            return programDetails;
        };

        $scope.getChannelDetails = function (show) {
            var channelDetails = '<div><img class="hidden-xs" src="' + $scope.getImage(show.program.preferredImage.uri) + '" /><p style="text-align: left;"><span class="program-details-header" translate="PLAYER_TITLE"></span><span class="program-details-body">' + show.program.title + '</span></p>';
            if (!show.duration && !show.startTime) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span>&nbsp;<span class="program-details-header"translate="PLAYER_DURATION"></span><span class="program-details-body"translate="PLAYER_NOT_AVAILABLE"></span></p>';
            } else {
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_TIME"></span><span class="program-details-body">' + getTime(1, show) + '</span></p><p><span class="program-details-header" translate="PLAYER_DURATION"></span><span class="program-details-body">' + show.duration + '</span>&nbsp;<span  class="program-details-body" translate="PLAYER_MINUTES"></span></p>';
            }
            if (!show.program.shortDescription) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body" translate="PLAYER_NOT_AVAILABLE"></span></p>';
            } else {
                channelDetails += '<p style="text-align: left"><span class="program-details-header" translate="PLAYER_DESCRIPTION"></span><span class="program-details-body">' + show.program.shortDescription + '</span></p></div>';
            }
            return channelDetails;
        };

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
    }
    ]);
}(angular.module('app')));
