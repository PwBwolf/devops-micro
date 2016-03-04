(function (app) {
    'use strict';

    app.controller('channelGuideCtrl', ['$scope', '$rootScope', '$', '$q', '$timeout', 'mediaSvc', '$filter', '$compile', function ($scope, $rootScope, $, $q, $timeout, mediaSvc, $filter, $compile) {




        var canceller;
        
        // gives a date string when printed
        var date = new Date();
        console.log('straight up date', date)

        // this is the same as dt, but doing it the angular way
        $scope.dt = $filter('date')(date, 'h:00 a');

        console.log('$scope variable testing', $scope.dt)
        
        // assign element with id channelGuidePanel to variable
        var channelGuideHolder = angular.element('#channelGuidePanel');

        // create timeHeaderBar element
        // ###### created this in the Jade file
        // this is a sibling element 
        // var timeHeaderBar = angular.element(document.createElement('div'));
        // now i'm just using this to find the timeHeaderBar div so the other stuff still works while I change things
        var timeHeaderBar = angular.element('#guideHeader');

        // Sam's code
        // angular.element is an alias for the jQuery function, aka $()
        // matches elements in the DOM based on the parameter passed in. This will match anything with the
        // channelTimePanel / channelLogos id's
        var channelTimeHolder = angular.element('#channelTimePanel');
        var channelLogoHolder = angular.element('#channelLogos');

        activate();

        // kind of like a main method. starts the functionality of the module.
        function activate() {
            
            // filters date string to just the time of day 0-12 am / pm
            var dt = $filter('date')(date, 'h:00 a');
            console.log('date after dt', dt)

            
            
            // create a ul in the page
            //var timeModule = angular.element(document.createElement('ul'));
            //var timeModule = angular.element('.time-module-for-testing')
            
            // create the first li which will be the time bar
            // var timeModuleItemFirst = angular.element(document.createElement('li'));

            // set id and class attributes for timeHeaderBar
            // ###### created this in the jade file
            // timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            
            // set innerHTML of the selected element
            // $(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            
            // I'm gonna guess this prepends somethings
            // $(timeModule).prepend(timeModuleItemFirst);

            // ************ Angularized ************
            // create the timebar above the chanels
            function getTimeSlots() {
                
                // get current date. this is date string.
                var hoursOffset = 0
                var currentSlot = new Date();
                var timeSlots = [];
                $scope.timeSlots = []

                for (var i = 1; i < 8; i++) {
                    
                    // var count = 60 * i
                    // calculating hours offset in milliseconds because getTime() uses UNIX epoch time.
                    hoursOffset = 3600 * 1000 * i
                    
                    // fill the array with times in one hour intervals
                    //timeSlots[i] = $filter('date')(new Date(currentSlot.getTime() + (hoursOffset)), 'h:00 a');
                    $scope.timeSlots[i] = $filter('date')(new Date(currentSlot.getTime() + (hoursOffset)), 'h:00 a');
                    
                    // insert list item element for each tme interval
                    //var timeModuleItemOthers = angular.element(document.createElement('li'));
                    
                    // add class attribute to item and fill it in with timeSlot
                    //$(timeModuleItemOthers).attr('class', 'time-module-item').html(timeSlots[i]);
                    
                    // add the list item to the unordered list
                    //$(timeModule).append(timeModuleItemOthers);
                }
            }

            getTimeSlots();
            // build the timeModule which is a ul of time slots and append it to the timeHeader Bar
            //$(timeHeaderBar).append(timeModule);
        }

        // media service has received array of channels. emitter events on root scope? ... can't be a great idea.
        $rootScope.$on('ChannelsLoaded', function () {
            // call getChannelGuide 1 ms after the ChannelsLoaded event happens
            $timeout(getChannelGuide, 1);
        });

        // Various functions in player-controller control how / what channels are displayed and then emit this event. what is channel filter event?
        $scope.$on('ChannelFilterEvent', function(event, args) {
            updateChannelGuide($rootScope.filteredChannels);
        });

        // This function creates the actual guide with the program listings and stuff
        // This should all go under channelGuideCtrl
        function getChannelGuide() {
            // start date is today
            var startDate = date;
            // $rootScope.filteredChannels is an array of objects for all the channels {id, logoUri, order, status, subscriptionPlan, tags_ids, title}
            // channelIds is just an array of the ids from $rootScope.filteredChannels
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            $scope.channelIds = channelIds

            // ********* Things I need on the front end **********
            // 

            // probably gets all channels and programming for the next 6 hours
            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                // sets program guide on root scope... dumb.
                // this an aray of objects with a channel id property and programs property. programs have
                // {description, startTime, endTime, genre, ratings, title}
                $rootScope.channelsEpg = channelsEpg;

                console.log(channelsEpg, channelsEpg.length)
                
                // loop over the channels and 
                angular.forEach(channelIds, function(channelId,chId) {

                    //console.log('\n\n\n')
                    // station is the chanel id. not sure exactly what the channel id is, but it doesn't need to be set to station here.
                    var station = channelId;
                    //console.log('station', station)
                    
                    // chIndex is the actual position in the guide the channel appears. For example: chIndex 0 will be the first one in the guide
                    var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                    //console.log('chIndex', chIndex)
                    
                    // a link to the logo for a given channel
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    //console.log('logo', logo)
                    
                    // the title of the channel, like HBO or Bloomberg
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    //console.log('channelTitle', channelTitle)
                    
                    // mostly the same as chIndex. probably will be used to move important channels to the top
                    var epgIndex =  _.findIndex(channelsEpg, {channel_id: station});
                    //console.log('epgIndex', epgIndex)
                    
                    // the programs for the current time period
                    // channelsEpg has the programs for the current channel
                    var lineUp = [];
                    if(epgIndex >= 0){
                        lineUp = channelsEpg[epgIndex].programs;
                        //console.log('lineUp is ', lineUp)                            
                    }

                    // make some divs and set their sizes
                    // is this happening in line or nested?
                    //var blahblah = document.createElement('div')
                    //console.log('seeing what happens with function inside a function', document.createElement('div'))
                    
                    // *******************************************
                    // create channelGuide and channelBlock divs for each element in channelId
                    // set the width and height of channelBlock
                    // make channelBlock the first child element of channelGuide
                    // do this for each channelId
                    // not sure where the channelGuide is getting attached to the page

                    // This must make the container for the channel logos
                    var channelGuide = angular.element(document.createElement('div'));
                    var channelBlock = angular.element(document.createElement('div'));
                    channelBlock[0].style.width = '154px';
                    channelBlock[0].style.height = '60px';
                    
                    // I think this was commented out here when I found it. Not sure though.
                    //$(channelLogo).attr('channel
                    //
                    // ', station).attr('id', 'channelGuideLogo').attr('title', channelTitle).attr('style', 'cursor: pointer; background: rgba(200,200,200,0.80) url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ').attr('ng-click', 'watchNow('+ chIndex + ',0)').attr('href', '') ;
                    //$(channelGuide).attr('channel', station).prepend(channelLogo);

                    // This makes channelBlock a child element of channelGuide
                    $(channelGuide).prepend(channelBlock);

                    var channelLineUp;

                    // run this if there are any programs scheduled for the channel
                    if (lineUp && lineUp.length > 0) {
                        angular.forEach(lineUp, function (data, id) {
                            //if (!data.image) {
                            //    channelLineUp = '<div title="' + data.description + '&#013;' + getTime(1, data) + '" style="' + timeSpan(startDate, data.startTime, data.endTime) + '">';
                            //} else
                            //{
                                console.log('data and id in getChannelGuide', data, id)
                                // ***************************************
                                // concatenate data into html elements
                                // append these elements (channelLineup) to the channelGuide
                                // need to figure out how to convert the logic in here to directives
                                // 

                                // id seems to refer to the order of the programs. if it's 0, it's the current 
                                // program and needs the additional span. probably for styling purposes.
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
                            //$(channelGuide).append(channelLineUp);
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
            //var timeModule = angular.element(document.createElement('ul'));
            //var timeModuleItemFirst = angular.element(document.createElement('li'));
            //timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            //$(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            //$(timeModule).prepend(timeModuleItemFirst);

            function getTimeSlots() {
                var currentSlot = new Date();
                for (var l = 1; l < 8; l++) {
                    var count = 60 * l;
                    var timeSlots = [];
                    timeSlots[l] = $filter('date')(new Date(currentSlot.getTime() + (count * 60 * 1000)), 'h:00 a');
                    //var timeModuleItemOthers = angular.element(document.createElement('li'));
                    //$(timeModuleItemOthers).attr('class', 'time-module-item').html(timeSlots[l]);
                    //$(timeModule).append(timeModuleItemOthers);
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
                channelGuideHolder[0].children[args.previousIndex+1].getElementsByTagName("div")[0].style.backgroundColor="#FFF";
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
