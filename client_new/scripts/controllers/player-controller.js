(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'homeScrnsSvc', 'loggerSvc', '$scope', function (userSvc, mediaSvc, homeScrnsSvc, loggerSvc, $scope) {
        $scope.usrMnScrn = {};
        
        
        $scope.playerOptions = {
            id: 'my-player',
            file: '/videos/yiptv.mp4',
            width: 902,
            height: 370,
            aspectratio: '16:9',
            primary: 'flash',
            logo: {
                file: '/images/tv_logo.png'
            }
        };
        /*
        $scope.channelSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 10,
            slideWidth: 150,
            slideMargin: 50,
            preloadImages: 'visible',
            pager: false
        };

        $scope.channelGuideSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 20,
            slideWidth: 150,
            slideMargin: 0,
            infiniteLoop: false,
            hideControlOnEnd: true,
            preloadImages: 'visible',
            pager: false
        };
        */
        

        activate();

        function activate() {
			$scope.usrMnScrn = homeScrnsSvc.getUsrData();
            $scope.isVisible = false;
            $scope.loadingChannels = true;
            
            //$scope.imgURL = "http://yipt.tmsimg.com/";
            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
                if ($scope.channels && $scope.channels.length > 0) {
                    
                    //console.log('Amt of promo chnls: '+$scope.channels.length);

                    
                    
                    //$scope.selectChannel(0);
					//for(var g in $scope.channels){
                        //if( g < 4){
                            //console.log('usrChannels: '+$scope.channels[g].name);
                            //$scope.dName = $scope.channels[g].name;
                            
                            /*
    		                mediaSvc.getChannelGuide($scope.channels[g].live_external_id, $scope.channels[g].name).success(function (channelGuide) {
                                $scope.airings = channelGuide[0].airings;
                                console.log('this is title: '+$scope.airings[0].program.title);
                                $scope.onAir = $scope.airings[0].program.title;
                                $scope.loadingChannelGuide = false;
                            }).error(function () {
                                $scope.loadingChannelGuide = false;
                                loggerSvc.logError('Error loading channel guide.');
                            });
                            */
    		                
                            //};
					//};

                    $scope.chnlClicked = function (index) {
                        $scope.selectedChnl = index;
                        $scope.selectChannel(index);
                        $scope.isVisible = true; 
                        //$scope.test = $scope.channels[index].name;
                        //$scope.test1 = $scope.airings
                        //console.log(index+' clicked & title: '+$scope.channels[index].name);
                        //$scope.playChannel(index);
                        //$scope.channelExpander = "channel-expander";
                        //$scope.selectedChnlIndex = index;
                        //$scope.playChannel(selectedChnlIndex);
                    };
                    
                    $scope.watchNow = function (index) {
                        $scope.selectedStream = index;
                        $scope.playChannel(index);
                    };

                    
                    $scope.chnlHover = function (index) {
                        $scope.chnlHovered = index;
                        $scope.selectOnAir(index);
                        //$scope.channelExpander = "channel-hover";
                    };
                    //for(var c in $scope.channels){
				        //$scope.selectChannel(c);
						//console.log($scope.channels[c].name);
						//}
                }
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading channel list.');
            });
        };
		//jwplayer("my-player").setup({ $scope.playerOptions; });
		//console.log($scope.channels.length);
		
        $scope.selectOnAir = function(channelIndex) {
            if(!$scope.loadingChannelGuide) {
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (showPreview) {
                    $scope.onAir = showPreview[0].airings;
                    $scope.onAirTitle = $scope.onAir[0].program.title;
                    $scope.details = $scope.getProgramDetails($scope.onAir[0]);
                    
                    $scope.loadingChannelGuide = false;
                }).error(function() {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
            
        };
        
        $scope.selectChannel = function (channelIndex) {
            if(!$scope.loadingChannelGuide) {
                //$scope.selectedChannelIndex = channelIndex;
                $scope.loadingChannelGuide = true;
				//console.log('chnl log: '+channelIndex);
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.showTimes = channelGuide[0].airings;
                    //console.log($scope.showTimes.length);
                    $scope.showListings = [];
                    //$scope.showListings = $scope.getChannelDetails($scope.showTimes);
                    //$scope.playChannel(channelIndex);
                    //$scope.onAir = $scope.airings[0].program.title;
                    //$scope.channelLogo = $scope.airings[0].image_url;
                    //$scope.details = $scope.getProgramDetails($scope.airings[0]);
                    //$scope.channelLineup = $scope.getChannelDetails()
                    //console.log('p d: '+$scope.showListings[0].name);
					for(var p in $scope.showTimes){
                        $scope.showListings[p] = $scope.getChannelDetails($scope.showTimes[p]);
                        //console.log('chnl: show '+p+' start-Time: '+$scope.showTimes[p].startTime);
                    }
					//console.log('this time: '+$scope.airings[].length);
					//console.log('air: '+$scope.airings )
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };
        
        
        $scope.playChannel = function (index, airing) {
            if(index) {
                mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
					//console.log(programDetails+' - '+' - '+index+' - '+channel.live_pc_url);
                   
                    $scope.channelLogo = $scope.channels[index].image_url;
                    $scope.channelNumber = $scope.channels[index].number;
                    $scope.channelName = $scope.channels[index].name;
                    
                    $scope.programDetails = $scope.getProgramDetails;
					//console.log('p d: '+$scope.programDetails);
                    
                    playStream();
                }).error(function () {
                    loggerSvc.logError('Error loading channel.');
                });
            }
        };
		
        function playStream(){
            jwplayer("my-player").setup({
                // good for fullScrn //
                // width: "100%",    //
                // aspectratio: "16:9"//
                //aspectratio: $scope.playerOptions.aspectratio,
                width: 912,
                height: 370,
                playlist: [{
                    image: $scope.channelLogo,
                    sources: [
                        //{file: bUrl+fUri+"&hash="+key+hmac }
                        //{ file: "http://yiptv-tele_caribe.hls.adaptive.level3.net" }
                        { file: $scope.playerOptions.file }
                    ],
                }],
                rtmp: {
                    bufferlength: 3
                },
                primary: 'flash',
                modes: [
                    {
                        'type': 'flash',
                        'src': 'scripts/config/jwplayer/jwplayer.flash.swf'
                    }
                ],
                //androidhls: true,
                autostart: true,
                fallback: false

            });
        };
        
        $scope.getTime = function (index, airing) {
            if (index === 0) {
                return 'on now';
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return pad(startTime.getHours()) + ':' + pad(startTime.getMinutes()) + ' - ' + pad(endTime.getHours()) + ':' + pad(endTime.getMinutes());
        };

        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }

        $scope.getDate = function (index, airing) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (index === 0) {
                return '';
            }
            var startTime = new Date(airing.startTime);
            return startTime.getDate() + ' ' + monthNames[startTime.getMonth()];
        };

        $scope.getImage = function(uri) {
            if(uri.indexOf('/images/channels/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        };

        $scope.getProgramDetails = function(airing) {
            var programDetails = '<p style="text-align: left;"><span class="program-details-header">On Now: </span><span class="program-details-body">' + airing.program.title + '</span></p>';
            if(!airing.duration && !airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">Not Available</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">Not Available</span></p>';
                } else {
                    programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + $scope.getTime(1, airing) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + airing.duration + ' min</span></p>';
            }   
            
            if(!airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">Not Available</span></p>';
                } else {
                    programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">' + airing.program.shortDescription + '</span></p>';
            }
           
            return programDetails;
        };

        $scope.getChannelDetails = function(show) {
            var channelDetails = '<div style="background:#444;"><img src="'+$scope.getImage(show.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="program-details-header">Title: </span><span class="program-details-body">' + show.program.title + '</span></p>';
            if(!show.duration && !show.startTime) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">Not Available</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">Not Available</span></p>';
                } else {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + $scope.getTime(1, show) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + show.duration + ' min</span></p>';
            }
            
            if(!show.program.shortDescription) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">Not Available</span></p>';
                } else {
                    channelDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">' + show.program.shortDescription + '</span></p></div>';
            }
           
            return channelDetails;
        };
        
        
    }]);

}(angular.module('app')));
