(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'homeScrnsSvc', 'loggerSvc', '$scope', '$window', '$compile', function (userSvc, mediaSvc, homeScrnsSvc, loggerSvc, $scope, $window, $compile) {
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
            //$scope.stations = [{id: '47620', name: 'TELESUR'}, {id: '44448', name: 'CENTROA'}, {id: '55912', name: 'TRO'}, {id: '65269', name: 'CSMOTV'}, {id: '59350', name: 'JBN'}];
            
            $scope.scrns = $window.document.getElementById('scrns');
            $scope.smm = $window.document.getElementById('teir_2');
            $scope.chnls = $window.document.getElementById('chnlMenuHldr');
            $scope.guide = $window.document.getElementById('userGuide');
            $scope.qlBox = $window.document.getElementsByClassName('quickLookBox');
            
            //$scope.onNow = $scope.prvwPnl.firstElementChild();
            //console.log('top: '+$scope.prvwPnl.length);
            //$scope.guide = angular.element('userGuide');
            //console.log('log: '+$($scope.guide).attr('class'));
            
			$scope.usrMnScrn = homeScrnsSvc.getUsrData();
            $scope.isVisible = false;
            $scope.closeVisible = false;
            //$scope.logoVisible = false;
            $scope.loadingChannels = true;
            //$scope.loadingStations = true;
            
            //$scope.imgURL = "http://yipt.tmsimg.com/";
            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
                
                if ($scope.channels && $scope.channels.length > 0) {
                    $scope.chnlClicked = function (index) {
                        $scope.selectedChnl = index;
                        $scope.selectChannel(index);
                        $scope.prvwPnl(index);
                        //$scope.brandImage = $scope.channels[index].image_url;
                        //console.log('brand: '+$scope.brandImage);
                        $scope.isVisible = true; 

                    };
                    
                    $scope.watchNow = function (index) {
                        $scope.selectedStream = index;
                        $scope.playChannel(index);
                    };
                    
                    /*
                    $scope.chnlHover = function (index) {
                        $scope.chnlHovered = index;
                        $scope.selectOnAir(index);
                    };
                    */
                    

                }
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading channel list.');
            });
            
            
            //angular.forEach(stations, function(value, key) {
            //  this.push(key + ': ' + value);
            //});
            
            //for (var p in $scope.stations){
            //angular.forEach($scope.stations, function() {
                //console.log('amt: '+ $scope.stations[p].id);
                /*
                mediaSvc.getChannelGuide($scope.stations[0].id, $scope.stations[0].name).success(function (channelView) {
                    $scope.inLineup = channelView[0].airings;
                    //$scope.inLineupTitle = $scope.inLineup[0].program.title;
                    $scope.dChnlLnup = [];
                    //console.log('amt: '+$scope.inLineup.length);
                    for (var s in $scope.inLineup){
                        $scope.dChnlLnup[s] = $scope.getChannelLineup($scope.inLineup[s]);
                    }
                    
                    $scope.loadingStations = false;
                }).error(function() {
                    $scope.loadingStations = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
                */
                //});
            
            
            //$scope.showCloseBtn = function(evt, attrs){
            $scope.showCloseBtn = function(){
                /* $on('insertItem',function(ev,attrs){ */
                    //console.log('itis: '+evt.target.id);
                    
                    if(angular.element('#closeBtn').length){
                        console.log('button already exists');
                        $scope.closeVisible = true;
                        $scope.logoVisible = true;
                    } else {
                        var prvwPnl = angular.element('#chnlMenuHldr');
                        var closethispanel = angular.element(document.createElement('closepnl')), 
                            channelIdent = angular.element(document.createElement('mylogo'));
                        var el = $compile( channelIdent )( $scope ), el1 = $compile( closethispanel )( $scope );
                        
                        
                          //where do you want to place the new element?
                        angular.element(prvwPnl).append(closethispanel).append(channelIdent);
                        console.log('close appended');
                    }
                
                    //$scope.channelIndex = target;
                  //$scope.insertHere = el;
            };
            
            $scope.getTarget = function(target){
                //$scope.channelIndex = target;
                $scope.channelIndex = $scope.channels[target].image_url
                console.log('the target: '+$scope.channelIndex);
            };
            
        };
       
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

					for(var p in $scope.showTimes){
                        $scope.showListings[p] = $scope.getChannelDetails($scope.showTimes[p]);
                        //console.log('chnl: show '+p+' start-Time: '+$scope.showTimes[p].startTime);
                    }
                    //console.log('slct: '+$scope.onNow.length);
                    
                    /// TARGET GENERATED LISTING ///
                        //var listing = $scope.showListings[0];
                        //$(listing).closest('div').attr('class', 'easeing');
                        //console.log('the html: '+$(listing).closest('div').html());
                        //console.log('the attr: '+$(listing).closest('div').attr('class'));
                    /// ------------------------ ///
                    
                    $scope.loadingChannelGuide = false;
                    }).error(function () {
                        $scope.loadingChannelGuide = false;
                        loggerSvc.logError('Error loading channel guide.');
                });
                
            }
        };
        
        $scope.prvwPnl = function(index){
            
            //var thisBrandImage = angular.element('#channelBrand').attr('class');
            // var thisBrandImage = angular.element('#channelBrand');
//                 $scope.$watch( $(thisBrandImage).attr('class'), function(evt){
//                     this.$on('change', )
//                 })
//
            //console.log('brand: '+thisBrandImage);
            var thisPreviewPnl = $window.document.getElementById('channelPreviewPanel').getElementsByTagName('div')[0];
                $(thisPreviewPnl).bind('click', function(evt){
                    $scope.playChannel(index);
                    console.log('done');
                });
                //console.log('prvw html: '+$(thisPreviewPnl).html());   ///closest('div').html());
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
                    
                    //$scope.programDetails = $scope.getProgramDetails;
					//console.log('p d: '+$scope.programDetails);
                    
                    playStream();
                }).error(function () {
                    loggerSvc.logError('Error loading channel.');
                });
            }
        };
		
        /* /// FILL THIS IN FOR FULL DESC OF SHOW IN LINEUP ///
        $scope.fullChannelLineup = function (channelIndex) {
            if(!$scope.loadingChannelGuide) {
                //$scope.selectedChannelIndex = channelIndex;
                $scope.loadingChannelGuide = true;
				//console.log('chnl log: '+channelIndex);
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.showTimes = channelGuide[0].airings;
                    //console.log($scope.showTimes.length);
                    $scope.showListings = [];

					for(var p in $scope.showTimes){
                        $scope.showListings[p] = $scope.getChannelDetails($scope.showTimes[p]);
                        //console.log('chnl: show '+p+' start-Time: '+$scope.showTimes[p].startTime);
                    }
                    
                    /// TARGET GENERATED LISTING ///
                        //var listing = $scope.showListings[0];
                        //$(listing).closest('div').attr('class', 'easeing');
                        //console.log('the html: '+$(listing).closest('div').html());
                        //console.log('the attr: '+$(listing).closest('div').attr('class'));
                    /// ------------------------ ///
                    
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };
        */
        
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
            var channelDetails = '<div><img src="'+$scope.getImage(show.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="program-details-header">Title: </span><span class="program-details-body">' + show.program.title + '</span></p>';
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
        
        $scope.getChannelLineup = function(chnl) {
            var ChannelLineup = '<div><img src="'+$scope.getImage(chnl.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + chnl.program.title + '</span></p>';
            if(!chnl.duration && !chnl.startTime) {
                ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">Not Available</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">Not Available</span></p>';
                } else {
                    ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">' + $scope.getTime(1, chnl) + '</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">' + chnl.duration + ' min</span></p>';
            }
            
            if(!chnl.program.shortDescription) {
                ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Description: </span><span class="channel-details-body">Not Available</span></p></div>';
                } else {
                    ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Description: </span><span class="channel-details-body">' + chnl.program.shortDescription + '</span></p></div>';
            }
           
            return ChannelLineup;
        };
        
    }])
    .directive('closepnl', function () {
        return {
          restrict: 'E',
          replace: true, 
          template: '<span data-ng-show=closeVisible>My chart</span>',
          link: function (scope, element, attrs) {
              attrs.$set('id', 'closeBtn');
              attrs.$set('class', 'closeBtn label label-danger');
              element.text('CLOSE');
              
              scope.closeVisible = true;
              element.bind('click', function(evt) {

                      $(scope.smm).switchClass('sgstdChnls_min', 'sgstdChnls', 500, 'easeInOutQuad');
                      $(scope.scrns).switchClass('scrnsMinimized', 'scrnsMaximized', 500, 'easeInOutQuad');
                      $(scope.qlBox).toggleClass('off');  //.find('div').toggleClass('off');
                      $(scope.chnls).attr('class', 'usrPrefsPnl');
                      
                      scope.isVisible = false;
                      scope.closeVisible = false;
                      scope.logoVisible = false;

              });
              
          } 
        };
    })
    .directive('mylogo', function () {
        return {
            restrict: 'E',
            replace: true, 
            template: '<div data-ng-show=logoVisible; style="background:rgba(200,200,200,0.85) url({{channelIndex}}) 50% no-repeat; background-size: contain;"></div>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'channelBrand');
                attrs.$set('class', 'brand_logo ');
                //attrs.$set('listIndex', scope.channelIndex);
                console.log('current channel: '+scope.channelIndex);
                
                scope.logoVisible = true;
                
            }
        };
    })

}(angular.module('app')));
