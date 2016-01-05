(function (app) {
    'use strict';

    app.controller('playerCtrl', ['_', '$', '$q', 'mediaSvc', '$scope', '$modal', '$rootScope', '$window', '$compile', '$filter', '$timeout', function (_, $, $q, mediaSvc, $scope, $modal, $rootScope, $window, $compile, $filter, $timeout) {

        var cancellerProgram, cancellerGuide, currentChannelIndex, channelsHasTags, previousChannelIndex;
        $scope.selectedPromo = -1;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];
        $scope.favoriteChannels = [];
        $scope.recentChannels = [];
        $scope.favoriteIcon = '../../images/favorite_white.png';
        currentChannelIndex = {index: undefined, channelId: undefined};
        previousChannelIndex = {index: undefined, channelId: undefined};
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = 'Title ...';
        $scope.programDescription = 'Description ...';
        $scope.showChannelFilter = false;
        channelsHasTags = false;
        
        var favoriteChannels = document.getElementById('favoriteChannels');
        var recentChannels = document.getElementById('recentChannels');
        var allChannels = document.getElementById('allChannels');
        
        activate();
        
        var currentSlot = new Date();
        var timeSlots = [];

        for (var l = 0; l < 8; l++) {
            var count = 60 * l;
            timeSlots.push({time: $filter('date')(new Date(currentSlot.getTime() + (count * 60 * 1000)), 'h:00 a')});
        }
        
        $scope.times = timeSlots;

        function activate() {
            $scope.channelList = $window.document.getElementById('channelMenuHolder');
            $scope.player = $window.document.getElementById('player');
            $scope.guide = $window.document.getElementById('userGuide');
            $scope.isVisible = false;
            $scope.closeVisible = false;

            mediaSvc.getUserChannels(function (data) {
                $rootScope.channels = data;
                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            });

            mediaSvc.getPromos(function (data) {
                $scope.promos = data;
            });

            mediaSvc.getChannelCategories(function (data) {
                $rootScope.channelCategories = data;
                for(var i = 0; i < data.length; i++) {
                    var genre = data[i].tags;
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

        $scope.promoSelected = function ($index) {
            $scope.selectedPromo = $index;
            if ($index > 4) {
                $('#playerBottom').animate({scrollLeft: '+=500'}, 1000);
            }
        };

        $scope.channelClicked = function (index) {
            $scope.selectedChannel = index;
            $scope.brandImage = $rootScope.filteredChannels[index].logoUri;
            $scope.brandName = $rootScope.filteredChannels[index].title;
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

        function toggleChannelFilter() {
            if ($rootScope.channels && $rootScope.channels.length > 0 && $rootScope.channelCategories && $rootScope.channelCategories.length > 0) {
                $scope.showChannelFilter = !$scope.showChannelFilter;
                if($scope.showChannelFilter) {
                    if(!channelsHasTags) {
                        addTagsToChannels();
                        channelsHasTags = true;
                    }
                    //$rootScope.filteredChannels = $rootScope.channels;
                    //$scope.clearAll();
                }
            }
        };

        $scope.$on('ToggleChannelFilterEvent', toggleChannelFilter);
        
        function addTagsToChannels() {
            var genres = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Genre'}), 'tags'), 'id');
            var languages = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Language'}), 'tags'), 'id');
            var regions = _.pluck(_.result(_.find($rootScope.channelCategories, {name: 'Origin'}), 'tags'), 'id');
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
        
        $scope.nextChannel = function () {
            if(currentChannelIndex != undefined) {
                var indexOfFilteredChannels = _.findIndex($rootScope.filteredChannels, {id: currentChannelIndex.channelId});
                var index = currentChannelIndex.index;
                var tempIndex;
                if(indexOfFilteredChannels >= 0) {
                    if(indexOfFilteredChannels + 1 >= $rootScope.filteredChannels.length) {
                        currentChannelIndex.channelId = $rootScope.filteredChannels[0].id;
                        currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                    } else {
                        currentChannelIndex.channelId = $rootScope.filteredChannels[indexOfFilteredChannels + 1].id;
                        currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                    }
                } else {
                    currentChannelIndex.channelId = $rootScope.filteredChannels[0].id;
                    currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                }
                tempIndex = currentChannelIndex.index;
                currentChannelIndex.index = index;
                $scope.watchNow(tempIndex, 0);
            }
        };
        
        $scope.previousChannel = function () {
            if(currentChannelIndex != undefined) {
                var indexOfFilteredChannels = _.findIndex($rootScope.filteredChannels, {id: currentChannelIndex.channelId});
                var index = currentChannelIndex.index;
                var tempIndex;
                if(indexOfFilteredChannels >= 0) {
                    if(indexOfFilteredChannels - 1 < 0) {
                        currentChannelIndex.channelId = $rootScope.filteredChannels[$rootScope.filteredChannels.length-1].id;
                        currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                    } else {
                        currentChannelIndex.channelId = $rootScope.filteredChannels[indexOfFilteredChannels - 1].id;
                        currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                    }
                } else {
                    currentChannelIndex.channelId = $rootScope.filteredChannels[0].id;
                    currentChannelIndex.index = _.findIndex($rootScope.channels, {id: currentChannelIndex.channelId});
                }
                tempIndex = currentChannelIndex.index;
                currentChannelIndex.index = index;
                $scope.watchNow(tempIndex, 0);
            }
        };

        $scope.toggleFavoriteChannel = function () {
            if(currentChannelIndex != undefined) {
                if(true) {
                    var index = _.findIndex($scope.favoriteChannels, {channel_id: currentChannelIndex.channelId});
                    if( index >= 0 ) {
                        $scope.favoriteChannels.splice(index, 1);
                        $scope.favoriteIcon = '../../images/favorite_white.png';
                        var req = {channelId: currentChannelIndex.channelId};
                        mediaSvc.removeFavoriteChannel(
                            req,
                            function (data) {
                                console.log('playerCtrl - remove favorite channel succeed:' + currentChannelIndex.channelId);
                            }, 
                            function (error) {
                                console.log('playerCtrl - remove favorite channel failed:' + currentChannelIndex.channelId);
                                console.log(error);
                            }
                        );
                    } else {
                        $scope.favoriteChannels.push({channel_id: currentChannelIndex.channelId});
                        $scope.favoriteIcon = '../../images/favorite_yellow.png';
                        var req = {channelId: currentChannelIndex.channelId};
                        mediaSvc.addFavoriteChannel(
                            req,
                            function (data) {
                                console.log('playerCtrl - add favorite channel succeed:' + currentChannelIndex.channelId);
                            }, 
                            function (error) {
                                console.log('playerCtrl - add favorite channel failed:' + currentChannelIndex.channelId);
                                console.log(error);
                            }
                        );
                    }
                }
            }
        };
        
        $scope.listFavoriteChannels = function () {
            $rootScope.filteredChannels = _.filter($rootScope.channels, function (item) {
                return _.some($scope.favoriteChannels, {channel_id: item.id});
            });
            $rootScope.$broadcast('ChannelFilterEvent');
            
            favoriteChannels.style.fontWeight = 'bold';
            favoriteChannels.style.color = '#337ab7';
            recentChannels.style.fontWeight = 'normal';
            recentChannels.style.color = 'white';
            allChannels.style.fontWeight = 'normal';
            allChannels.style.color = 'white';
        };
        
        $scope.listRecentChannels = function () {
            $rootScope.filteredChannels = _.filter($rootScope.channels, function (item) {
                return _.some($scope.recentChannels, {channelId: item.id});
            });
            $rootScope.$broadcast('ChannelFilterEvent');
            
            favoriteChannels.style.fontWeight = 'normal';
            favoriteChannels.style.color = 'white';
            recentChannels.style.fontWeight = 'bold';
            recentChannels.style.color = '#337ab7';
            allChannels.style.fontWeight = 'normal';
            allChannels.style.color = 'white';
        };
        
        $scope.listAllChannels = function () {
            $rootScope.filteredChannels = $rootScope.channels;

            $rootScope.$broadcast('ChannelFilterEvent');
            
            favoriteChannels.style.fontWeight = 'normal';
            favoriteChannels.style.color = 'white';
            recentChannels.style.fontWeight = 'normal';
            recentChannels.style.color = 'white';
            allChannels.style.fontWeight = 'bold';
            allChannels.style.color = '#337ab7';
        };
        
        $scope.programDetail = function () {
            
            var modalInstance = $modal.open({
                templateUrl: 'infoModal.html',
                controller: 'infoModalCtrl'
              });
            
        };
        
        function getFirstProgram(index) {
            if (cancellerProgram) {
                cancellerProgram.resolve();
            }
            cancellerProgram = $q.defer();
            $scope.programDetails = null;
            if (index > -1) {
                mediaSvc.getChannelGuide($rootScope.filteredChannels[index].id, 1, cancellerProgram).success(function (programs) {
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
            mediaSvc.getChannelGuide($rootScope.filteredChannels[index].id, 12, cancellerGuide).success(function (programs) {
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
                $scope.channelLogo = $rootScope.channels[index].logoUri;
                var programInfo = getProgramInfo(index);
                $scope.programTitle = programInfo.title;
                $scope.programDescription = programInfo.description;
                previousChannelIndex.index = currentChannelIndex.index;
                currentChannelIndex.index = index;
                currentChannelIndex.channelId = $rootScope.channels[index].id;
                addRecentChannel(currentChannelIndex.channelId);
                if(_.findIndex($scope.favoriteChannels, {channel_id: $rootScope.channels[index].id}) >= 0) {
                    $scope.favoriteIcon = '../../images/favorite_yellow.png';
                } else {
                    $scope.favoriteIcon = '../../images/favorite_white.png';
                }
                $rootScope.$broadcast('PlayChannel', {currentIndex: index, previousIndex: previousChannelIndex.index});
                playStream();
            });
        };

        function addRecentChannel(channelId) {
            var index = _.findIndex($scope.recentChannels, {channelId: channelId});
            if(index < 0) {
                $scope.recentChannels.push({channelId: channelId});
            }
        }
        
        function getProgramInfo(index) {
            var epgIndex = _.findIndex($rootScope.channelsEpg, {channel_id: $rootScope.channels[index].id});
            var lineUp = [];
            var info = {title: 'Title ...', description: 'Description ...', showTime: 'Show Time ...'};
            var now = new Date();
            if(epgIndex >= 0) {
                lineUp = $rootScope.channelsEpg[epgIndex].programs;
                var endTime;
                if(lineUp.length > 0) {
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
        }
        
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

//        $scope.favoriteChannelSelected = function ($index) {
//            $scope.selectedFavoriteChannel = $index;
//        };

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
            
            $rootScope.filteredChannels = $rootScope.channels;
            $rootScope.$broadcast('ChannelFilterEvent');
        };

        function getDuration(startTime, endTime) {
            return Math.floor((new Date(endTime) - new Date(startTime)) / 1000 / 60);
        }

        function filterChannels() {
            //$scope.filteredChannels = $rootScope.channels;
            //$timeout.cancel($rootScope.timer);
            var filteredChannelsFromGenres = [];
            if ($scope.selectedGenres.length > 0) {
                filteredChannelsFromGenres = _.filter($rootScope.channels, function (item) {
                    return _.contains($scope.selectedGenres, item.genre);
                });
            } else {
                filteredChannelsFromGenres = $rootScope.channels;
            }
            
            var filteredChannelsFromRegions = [];
            if ($scope.selectedRegions.length > 0) {
                filteredChannelsFromRegions = _.filter(filteredChannelsFromGenres, function (item) {
                    return _.contains($scope.selectedRegions, item.region);
                });
            } else {
                filteredChannelsFromRegions = filteredChannelsFromGenres;
            }
            
            var filteredChannelsFromAudiences = [];
            if ($scope.selectedAudiences.length > 0) {
                filteredChannelsFromAudiences = _.filter(filteredChannelsFromRegions, function (item) {
                    return _.contains($scope.selectedAudiences, item.audience);
                });
            } else {
                filteredChannelsFromAudiences = filteredChannelsFromRegions;
            }
            
            var filteredChannelsFromLanguages = [];
            if ($scope.selectedLanguages.length > 0) {
                filteredChannelsFromLanguages = _.filter(filteredChannelsFromAudiences, function (item) {
                    return _.contains($scope.selectedLanguages, item.language);
                });
            } else {
                filteredChannelsFromLanguages = filteredChannelsFromAudiences;
            }
            
            $scope.filteredChannels = filteredChannelsFromLanguages;
            $rootScope.filteredChannels = filteredChannelsFromLanguages;
        }

        $scope.toggleGenreSelection = function (tag) {
            var index = $scope.selectedGenres.indexOf(tag);
            if (index > -1) {
                $scope.selectedGenres.splice(index, 1);
            } else {
                $scope.selectedGenres.push(tag);
            }
            filterChannels();
            $rootScope.$broadcast('ChannelFilterEvent');
        };

        $scope.toggleRegionSelection = function (tag) {
            var index = $scope.selectedRegions.indexOf(tag);
            if (index > -1) {
                $scope.selectedRegions.splice(index, 1);
            } else {
                $scope.selectedRegions.push(tag);
            }
            filterChannels();
            $rootScope.$broadcast('ChannelFilterEvent');
        };

        $scope.toggleAudienceSelection = function (tag) {
            var index = $scope.selectedAudiences.indexOf(tag);
            if (index > -1) {
                $scope.selectedAudiences.splice(index, 1);
            } else {
                $scope.selectedAudiences.push(tag);
            }
            filterChannels();
            $rootScope.$broadcast('ChannelFilterEvent');
        };

        $scope.toggleLanguageSelection = function (tag) {
            var index = $scope.selectedLanguages.indexOf(tag);
            if (index > -1) {
                $scope.selectedLanguages.splice(index, 1);
            } else {
                $scope.selectedLanguages.push(tag);
            }
            filterChannels();
            $rootScope.$broadcast('ChannelFilterEvent');
        };

        /**
         * Regarding EPG scrolling
         */
        var tempScrollTop = $("#userGuide").scrollTop();
        var tempScrollLeft = $("#userGuide").scrollLeft();

        var scrollListener = $(".scrollListener");

        scrollListener.scroll(function(){
            scrollListener.scrollTop($("#userGuide").scrollTop());
            scrollListener.scrollLeft($("#userGuide").scrollLeft());
        });

    }]);
    
    app.controller('filterPanelSlideCtrl',['$scope',function($scope){

        $scope.checked = false; // This will be binded using the ps-open attribute

        $scope.toggle = function(){
            $scope.checked = !$scope.checked;
            if($scope.checked) {
                $scope.$emit('ToggleChannelFilterEvent');
            }
        }

    }]);
    
    app.controller('programDetailSlideCtrl',['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.checked = false; // This will be binded using the ps-open attribute
        var programDetailSlider = document.getElementById('programDetailSlider');
        $scope.program = {title: 'Title ...', description: 'Description ...', showTime: 'ShowTime ...'};
        
        $scope.toggleProgramDetail = function(){
            var width = $(window).width();
            
            programDetailSlider.style.marginLeft = (width - 150) / 2 + 'px';
            
            $scope.checked = !$scope.checked;
            if($scope.checked) {
                $scope.program = $rootScope.program; 
            }

        }
    }]);
}(angular.module('app')));
