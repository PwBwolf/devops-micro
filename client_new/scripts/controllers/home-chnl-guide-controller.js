(function (app) {
    'use strict';

    app.controller('homeChnlGuideCtrl', ['$scope', '$', 'userSvc', 'mediaSvc', '$filter', '$compile', function ($scope, $, userSvc, mediaSvc, $filter, $compile) {

		init();
		function init(){

            var dt = $filter('date')(new Date(), 'h:00 a');
            console.log('dt: '+dt);
            
            $scope.getTimeSlot = function (){
                var timeSlot = new Date();
                var timeSlot = $filter('date')( new Date(timeSlot.getTime() + (60 * 60 * 1000)), 'h:00 a');

                return timeSlot;
            };
            

            $scope.logoVisible = false;
            $scope.loadingStations = true;
            var chnlGdeHldr = angular.element('#channelGuidePanel');
            
            var timeHeaderBar = angular.element(document.createElement('div')), timeModule = angular.element(document.createElement('ul')), timeModuleItem_first = angular.element(document.createElement('li'));
                timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guideHeader');
            $(timeModuleItem_first).attr('class', 'timeModuleItem').html(dt);
            $(timeModule).prepend(timeModuleItem_first);
            $scope.getNextTimeSlot = function (){
                var crntSlot = new Date();
                for (var l = 1; l < 12; l++ ){
                    var cnt = 60 * l;
                    var newTimeSlot = [];
                        newTimeSlot[l] = $filter('date')(new Date(crntSlot.getTime() + (cnt * 60 * 1000)), 'h:00 a');
                    
                    var timeModuleItem_others = angular.element(document.createElement('li'));
                    $(timeModuleItem_others).attr('class', 'timeModuleItem').html(newTimeSlot[l]);
                    $(timeModule).append(timeModuleItem_others);

                };
                return $scope.newTimeSlot;
                
            };
            $scope.getNextTimeSlot();
            $(timeHeaderBar).append(timeModule);
            //console.log('usr: '+thisData);
            var guideDocked = false;
            var guideTop = timeHeaderBar.offset().top;
            
            
            
            
            /// POSITION GUIDE BAR STATIC WHEN SCROLL /// 
            /// ===================================== ///
            
            $(chnlGdeHldr).on('scroll', function(){
                console.log('scrolling...');
                
                if( !guideDocked && ($(timeHeaderBar).offset().top - scrollTop() < 729)){

                    console.log('auto: '+$(timeHeaderBar).offset().left);
                    $(timeHeaderBar).attr('style', 'position:fixed; left:'+$(timeHeaderBar).offset().left+'px;').next().attr('style', 'margin-top:33px');
                    
                    console.log('scroll: '+$(timeHeaderBar).scrollLeft());
                    guideDocked = true;
                } 

                
            });
            
            
            
            /// ALL USER CHANNELS AVAILABLE BELOW ///
            userSvc.getUserChannels(function (data) {
                $scope.dUserChannels = data;
                
                angular.forEach($scope.dUserChannels, function( value, key ){
   
                    if(key < 8){
                        mediaSvc.getChannelGuide(value.live_external_id, value.identifier).success(function (channelView) {
                    
                        var dLogo = channelView[0].preferredImage.uri;
                        var dStation = channelView[0].callSign;
                        var inLineup = channelView[0].airings;
                        $scope.dChnlLnup = [];
                        $scope.dStation = channelView[0].callSign;
                        console.log('it is: '+$scope.getImage(dLogo));
                    
                    
                        var userChnlGde = [], linkShow = [], dCntnt = [], userChnlLogo = [];

                            setChannelLineup();
                      
                        function setChannelLineup(){
                            userChnlGde = angular.element(document.createElement('div'));
                            userChnlLogo = angular.element(document.createElement('div'));
                            $(userChnlLogo).attr('id', 'chnl-guide-logo').attr('class', 'guide-logo').attr('style', 'background: rgba(200,200,200,0.80) url('+$scope.getImage(dLogo)+') 50% no-repeat; background-size:contain ');
                            $(userChnlGde).attr('chnl', dStation).attr('style', 'background:'+value.color).prepend(userChnlLogo);
                        
                            angular.forEach(inLineup, function(data){
                                var dShowStartTime = $scope.getStartTime(1, data), dShowEndTime = $scope.getEndTime(1, data), dNextTimeSlot = $scope.getTimeSlot(), firstShowTime = dt+':00';
                                
                                if(!data.program.preferredImage.uri) { 
                                    $scope.ChannelLineup = '<div style="width:'+$scope.timeSpan(data.duration)+'"><img src="../images/f-logo.png" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + data.program.title + '</span></p>';
                                    } else {
                                        $scope.ChannelLineup = '<div style="width:'+$scope.timeSpan(data.duration)+'"><img src="'+$scope.getImage(data.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + data.program.title + '</span></p>';
                                        }
                                        if(!data.duration && !data.startTime) {
                                            $scope.ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">Not Available</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">Not Available</span></p>';
                                            } else {
                                                $scope.ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">' + $scope.getTime(1, data) + '</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">' + data.duration + ' min</span></p></div>';
                                                }
                                                
                            
                                $(userChnlGde).append($scope.ChannelLineup);
                                $(userChnlGde).attr('class', 'chnlDesc');
                                $(userChnlGde).attr('id', 'channelGuideDesc');
                                    
                                
                                //}
                            });

                            angular.element(chnlGdeHldr).prepend(timeHeaderBar).append(userChnlGde);
                        }
                    
                        $scope.loadingStations = false;
                    }).error(function() {
                        $scope.loadingStations = false;
                        loggerSvc.logError('Error loading tv channel guide.');
                    });
                        } else {
                            return 'end';
                            }
                            
                });
            });

            $scope.timeSpan = function(time){
                $scope.timeS = time * 4+'px';
                return $scope.timeS;
            }
            
            $scope.chnlHover = function (index) {
                $scope.chnlHovered = index;
                $scope.selectOnAir(index);
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
            
            $scope.showCloseBtn = function(){

                    if(angular.element('#closeBtn').length){
                        console.log('button already exists');
                        $scope.closeVisible = true;
                        $scope.logoVisible = true;
                    } else {
                        var prvwPnl = angular.element('#chnlMenuHldr');
                        var closethispanel = angular.element(document.createElement('closepnl')), 
                            channelIdent = angular.element(document.createElement('mylogo'));
                        var el = $compile( channelIdent )( $scope ), el1 = $compile( closethispanel )( $scope );
                        
                        
                        angular.element(prvwPnl).append(closethispanel).append(channelIdent);
                        console.log('close appended');
                    }

            };
            
            $scope.getTarget = function(target){
                //$scope.channelIndex = target;
                $scope.channelIndex = $scope.channels[target].image_url
                console.log('the target: '+$scope.channelIndex);
            };
            
		}
        
    /// ============ INIT END ============ /// 
		function scrollTop() {
			return document.body.scrollTop || document.documentElement.scrollTop;
		};
        
        
        $scope.getTime = function (index, airing) {
            if (index === 0) {
                return 'on now';
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return pad(startTime.getHours()) + ':' + pad(startTime.getMinutes()) + ' - ' + pad(endTime.getHours()) + ':' + pad(endTime.getMinutes());
        };
        
        $scope.getStartTime = function (index, airing) {
            if (index === 0) {
                console.log('nice '+airing[index].startTime);
                return 'on now';
            }
            
            var showStartTime = new Date(airing.startTime);
            return pad(showStartTime.getHours()) + ':' + pad(showStartTime.getMinutes());
        };
        
        $scope.getEndTime = function (index, airing) {
            
            var showEndTime = new Date(airing.endTime);
            return pad(showEndTime.getHours()) + ':' + pad(showEndTime.getMinutes());
        };

        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        };

        $scope.getDate = function (index, airing) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (index === 0) {
                return '';
            }
            var startTime = new Date(airing.startTime);
            return startTime.getDate() + ' ' + monthNames[startTime.getMonth()];
        };
        
        $scope.getImage = function(uri) {
            if(!uri){
                return '/images/f-logo.png';
                } else if(uri.indexOf('/images/channels/') === 0) {
                    return uri;
                    } else {
                        return $scope.appConfig.graceNoteImageUrl + uri;
                        }
        };
        
        $scope.getChannelLineup = function(chnl) {
            var ChannelLineup = '<div style="width:'+$scope.timeSpan+'"><img src="'+$scope.getImage(chnl.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + chnl.program.title + '</span></p>';
            if(!chnl.duration && !chnl.startTime) {
                ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">Not Available</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">Not Available</span></p>';
                } else {
                    ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">' + $scope.getTime(1, chnl) + '</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">' + chnl.duration + ' min</span></p></div>';
            }

            return ChannelLineup;
        };
		       
    }])
  
}(angular.module('app')));
