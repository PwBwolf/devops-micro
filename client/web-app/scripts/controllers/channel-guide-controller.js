(function (app) {
    'use strict';

    app.controller('channelGuideCtrl', ['$scope', '$rootScope', '$', '$q', '$timeout', 'mediaSvc', '$filter', '$compile', function ($scope, $rootScope, $, $q, $timeout, mediaSvc, $filter, $compile) {




        var canceller;
        var date = new Date();
        var channelGuideHolder = angular.element('#channelGuidePanel');
        var timeHeaderBar = angular.element(document.createElement('div'));

        // Sam's code
        var channelTimeHolder = angular.element('#channelTimePanel');
        var channelLogoHolder = angular.element('#channelLogos');

        activate();

        function activate() {
            var dt = $filter('date')(date, 'h:00 a');
            var timeModule = angular.element(document.createElement('ul'));
            var timeModuleItemFirst = angular.element(document.createElement('li'));
            timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            $(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            $(timeModule).prepend(timeModuleItemFirst);

            function getTimeSlots() {
                var currentSlot = new Date();
                var timeSlots = [];

                for (var l = 1; l < 8; l++) {
                    var count = 60 * l;
                    timeSlots[l] = $filter('date')(new Date(currentSlot.getTime() + (count * 60 * 1000)), 'h:00 a');
                    var timeModuleItemOthers = angular.element(document.createElement('li'));
                    $(timeModuleItemOthers).attr('class', 'time-module-item').html(timeSlots[l]);
                    $(timeModule).append(timeModuleItemOthers);
                }
            }

            getTimeSlots();
            $(timeHeaderBar).append(timeModule);
        }

        $rootScope.$on('ChannelsLoaded', function () {
            $timeout(getChannelGuide, 1);
        });

        $scope.$on('ChannelFilterEvent', function(event, args) {
            updateChannelGuide($rootScope.filteredChannels);
        });

        function getChannelGuide() {
            var startDate = date;
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });

            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                $rootScope.channelsEpg = channelsEpg;

                angular.forEach(channelIds, function(channelId,chId) {

                    var station = channelId;
                    var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    var epgIndex =  _.findIndex(channelsEpg, {channel_id: station});
                    var lineUp = [];
                    if(epgIndex >= 0)
                       lineUp = channelsEpg[epgIndex].programs;

                    var channelGuide = angular.element(document.createElement('div'));
                    var channelBlock = angular.element(document.createElement('div'));
                    channelBlock[0].style.width = '154px';
                    channelBlock[0].style.height = '60px';
                    //$(channelLogo).attr('channel
                    //
                    // ', station).attr('id', 'channelGuideLogo').attr('title', channelTitle).attr('style', 'cursor: pointer; background: rgba(200,200,200,0.80) url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ').attr('ng-click', 'watchNow('+ chIndex + ',0)').attr('href', '') ;
                    //$(channelGuide).attr('channel', station).prepend(channelLogo);
                    $(channelGuide).prepend(channelBlock);

                    var channelLineUp;
                    if (lineUp && lineUp.length > 0) {
                        angular.forEach(lineUp, function (data, id) {
                            //if (!data.image) {
                            //    channelLineUp = '<div title="' + data.description + '&#013;' + getTime(1, data) + '" style="' + timeSpan(startDate, data.startTime, data.endTime) + '">';
                            //} else
                            //{
                                if(id === 0){
                                    channelLineUp = '<div title="' + data.title +'&#13;&#10;' + data.description + '&#013;' + getTime(1, data) + '" style="cursor: pointer;' + timeSpan(startDate, data.startTime, data.endTime) + '" ng-click="watchNow('+ chIndex + ',0)" href="">';
                                    channelLineUp += '<span style="float:right"> <img src="../images/play-button.png" /> </span>';
                                }
                                else{
                                    channelLineUp = '<div title="' + data.title +'&#13;&#10;' + data.description + '&#013;' + getTime(1, data) + '" style="' + timeSpan(startDate, data.startTime, data.endTime) + '">';
                                }
                            //}
                            channelLineUp += '<p style="text-align: left;"><span class="channel-details-body">' + data.title + '</span></p>';
                            channelLineUp += '<p style="text-align: left"></span><span class="channel-details-body">' + getTime(1, data) + '</span></p></div>';
                            $(channelGuide).append(channelLineUp);
                        });
                    } else {
                        channelLineUp = '<div title="' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '" style="width:300px;border-right:none"><img src="../images/empty.png" /><p style="text-align: left;"><span class="channel-details-body">' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '</span></p>';
                        $(channelGuide).append(channelLineUp);
                    }

                    $(channelGuide).attr('class', 'channel-description');
                    $(channelGuide).attr('channel', station).attr('id', 'channelGuideDescription');
                    $compile(channelGuide)($scope);
                    //angular.element(channelGuideHolder).prepend(timeHeaderBar).append(channelGuide);

                    // Sam's code
                    angular.element(channelTimeHolder).append(timeHeaderBar);
                    angular.element(channelGuideHolder).append(channelGuide);
                    //angular.element(channelLogoHolder).attr('channel', station).prepend(channelLogo);
               });
            }).error(function () {
                    console.log('channel guide ctrl error bloc');
            });
        }

        function updateChannelGuide(filteredChannels) {

            var startDate = new Date();
            var channelIds = filteredChannels.map(function (item) { return item.id; });

            var children = channelGuideHolder[0].children;
            //var childrenLogo = channelLogoHolder[0].children;
            for(var i = 1; i < children.length; ++i) {
                var channelId = children[i].getAttribute('channel');
                var channelFound = false;
                for(var j = 0; j < filteredChannels.length; ++j) {
                    if(channelId == filteredChannels[j].id) {
                        channelFound = true;
                        break;
                    }
                }

                if(channelFound) {
                    channelGuideHolder[0].children[i].style.display = 'block';
                    //channelLogoHolder[0].children[i].style.display = 'block';
                } else {
                    channelGuideHolder[0].children[i].style.display = 'none';
                    //channelLogoHolder[0].children[i].style.display = 'none';
                }
            }
        }

        function timeSpan(guideStartTime, programStartTime, programEndTime) {
            var duration = (new Date(programEndTime) - new Date(programStartTime)) / (1000 * 60);
            if (guideStartTime && programStartTime) {
                var hourDate = new Date(guideStartTime);
                hourDate.setMinutes(0);
                hourDate.setSeconds(0);
                var diff = Math.floor((hourDate.getTime() - new Date(programStartTime).getTime()) / (1000 * 60));
                if (diff >= 0) {
                    return 'width:' + ((duration - diff) * 5) + 'px';
                } else {
                   return  'width:' + (duration * 5) + 'px;border-left: 1px solid #000033';
                }
            } else {
                return 'width:' + (duration * 5) + 'px';
            }
        }

        function getTime(index, airing) {
            if (index === 0) {
                return $filter('translate')('CHANNEL_GUIDE_ON_NOW');
            }
            if (!airing) {
                return '';
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
                return uri;
            }
        }
    }]);


    app.controller('channelLogoController', ['$scope', '$rootScope', '$', '$q', '$timeout', 'mediaSvc', '$filter', '$compile', function ($scope, $rootScope, $, $q, $timeout, mediaSvc, $filter, $compile) {

        var canceller;
        var date = new Date();
        var channelGuideHolder = angular.element('#channelLogoPanel');
        //var timeHeaderBar = angular.element(document.createElement('div'));

        // Sam's code
        //var channelTimeHolder = angular.element('#channelTimePanel');
        //var channelLogoHolder = angular.element('#channelLogos');

        //activate();

        function activate() {
            var dt = $filter('date')(date, 'h:00 a');
            var timeModule = angular.element(document.createElement('ul'));
            var timeModuleItemFirst = angular.element(document.createElement('li'));
            //timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            $(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            $(timeModule).prepend(timeModuleItemFirst);

            function getTimeSlots() {
                var currentSlot = new Date();
                for (var l = 1; l < 8; l++) {
                    var count = 60 * l;
                    var timeSlots = [];
                    timeSlots[l] = $filter('date')(new Date(currentSlot.getTime() + (count * 60 * 1000)), 'h:00 a');
                    var timeModuleItemOthers = angular.element(document.createElement('li'));
                    $(timeModuleItemOthers).attr('class', 'time-module-item').html(timeSlots[l]);
                    $(timeModule).append(timeModuleItemOthers);
                }
            }

            getTimeSlots();
            //$(timeHeaderBar).append(timeModule);
        }

        $rootScope.$on('ChannelsLoaded', function () {
            $timeout(getChannelGuide, 1);
        });

        $scope.$on('ChannelFilterEvent', function(event, args) {
            updateChannelGuide($rootScope.filteredChannels);
        });

        $scope.$on('PlayChannel', function(event, args){
            if(args.previousIndex != undefined) {
                channelGuideHolder[0].children[args.previousIndex+1].getElementsByTagName("div")[0].style.backgroundColor="#000F29";
            }
            channelGuideHolder[0].children[args.currentIndex+1].getElementsByTagName("div")[0].style.backgroundColor="#337ab7";
        });

        function getChannelGuide() {

            var startDate = date;
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });

            angular.forEach(channelIds, function(channelId,chId) {

                var station = channelId;
                var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                var channelTitle = $rootScope.filteredChannels[chIndex].title;

                var channelGuide = angular.element(document.createElement('div'));
                var channelLogo = angular.element(document.createElement('div'));

                $(channelLogo).attr('id', 'channelGuideLogo').attr('title', channelTitle).attr('style', 'cursor: pointer; background: #FFF url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ').attr('ng-click', 'watchNow('+ chIndex + ',0)').attr('href', '') ;

                $(channelGuide).attr('channel', station).prepend(channelLogo);

                $(channelGuide).attr('class', 'channel-description');
                $(channelGuide).attr('id', 'channelGuideDescription');
                $compile(channelGuide)($scope);
                //angular.element(channelGuideHolder).prepend(timeHeaderBar).append(channelGuide);

                // Sam's code
                //angular.element(channelTimeHolder).append(timeHeaderBar);
                angular.element(channelGuideHolder).append(channelGuide);
                //angular.element(channelLogoHolder).attr('channel', station).prepend(channelLogo);

            });
        }

        function updateChannelGuide(filteredChannels) {

            var startDate = new Date();
            var channelIds = filteredChannels.map(function (item) { return item.id; });

            var children = channelGuideHolder[0].children;
            //var childrenLogo = channelLogoHolder[0].children;
            for(var i = 1; i < children.length; ++i) {
                var channelId = children[i].getAttribute('channel');
                var channelFound = false;
                for(var j = 0; j < filteredChannels.length; ++j) {
                    if(channelId == filteredChannels[j].id) {
                        channelFound = true;
                        break;
                    }
                }

                if(channelFound) {
                    channelGuideHolder[0].children[i].style.display = 'block';
                    //channelLogoHolder[0].children[i].style.display = 'block';
                } else {
                    channelGuideHolder[0].children[i].style.display = 'none';
                    //channelLogoHolder[0].children[i].style.display = 'none';
                }
            }
        }

        function timeSpan(guideStartTime, programStartTime, programEndTime) {
            var duration = (new Date(programEndTime) - new Date(programStartTime)) / (1000 * 60);
            if (guideStartTime && programStartTime) {
                var hourDate = new Date(guideStartTime);
                hourDate.setMinutes(0);
                hourDate.setSeconds(0);
                var diff = Math.floor((hourDate.getTime() - new Date(programStartTime).getTime()) / (1000 * 60));
                if (diff >= 0) {
                    return 'width:' + ((duration - diff) * 5) + 'px';
                } else {
                    return  'width:' + (duration * 5) + 'px;border-left: 1px solid';
                }
            } else {
                return 'width:' + (duration * 5) + 'px';
            }
        }

        function getTime(index, airing) {
            if (index === 0) {
                return $filter('translate')('CHANNEL_GUIDE_ON_NOW');
            }
            if (!airing) {
                return '';
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
                return uri;
            }
        }
    }]);
}(angular.module('app')));
