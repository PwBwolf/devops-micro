(function (app) {
    'use strict';

    app.controller('homeChnlGuideCtrl', ['$scope', '$', 'homeChnlGuideSvc','userSvc', 'mediaSvc', '$filter', '$compile', function ($scope, $, homeChnlGuideSvc, userSvc, mediaSvc, $filter, $compile) {

		init();
		function init(){
            
			$scope._12pm = homeChnlGuideSvc.getGdeData1();
			$scope._1pm = homeChnlGuideSvc.getGdeData2();
			$scope._2pm = homeChnlGuideSvc.getGdeData3();
			$scope._3pm = homeChnlGuideSvc.getGdeData4();
			$scope._4pm = homeChnlGuideSvc.getGdeData5();
			$scope._5pm = homeChnlGuideSvc.getGdeData6();
			$scope._6pm = homeChnlGuideSvc.getGdeData7();
            
            $scope.stations = [
                {id: '47620', name: 'TELESUR', color: 'burlywood'}, 
                {id: '44448', name: 'CENTROA', color: 'cadetblue'}, 
                {id: '55912', name: 'TRO', color: 'darkgrey'}, 
                {id: '65269', name: 'CSMOTV', color: 'darksalmon'},
                {id: '59350', name: 'JBN', color: 'goldenrod'}
            ];
            
            var dt = $filter('date')(new Date(), 'h:00 a');
            console.log('dt: '+dt);
            
            $scope.getTimeSlot = function (){
                var timeSlot = new Date();
                var timeSlot = $filter('date')( new Date(timeSlot.getTime() + (60 * 60 * 1000)), 'h:00 a');

                return timeSlot;
            };
            

            $scope.logoVisible = false;
            $scope.loadingStations = true;
            //for (var p in $scope.stations){
            var chnlGdeHldr = angular.element('#channelGuidePanel');
            //alert($(chnlGdeHldr).offsetTop);
            
            var timeHeaderBar = angular.element(document.createElement('div')), timeModule = angular.element(document.createElement('ul')), timeModuleItem_first = angular.element(document.createElement('li'));
                timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guideHeader');
            $(timeModuleItem_first).attr('class', 'timeModuleItem').html(dt);
            //$(timeModuleItem_others).attr('class', 'timeModuleItem').html($scope.getTimeSlot());
            $(timeModule).prepend(timeModuleItem_first);
            //$scope.getNextTimeSlot();
            $scope.getNextTimeSlot = function (){
                var crntSlot = new Date();
                for (var l = 1; l < 12; l++ ){
                    var cnt = 60 * l;
                    var newTimeSlot = [];
                        newTimeSlot[l] = $filter('date')(new Date(crntSlot.getTime() + (cnt * 60 * 1000)), 'h:00 a');
                    
                    var timeModuleItem_others = angular.element(document.createElement('li'));
                    $(timeModuleItem_others).attr('class', 'timeModuleItem').html(newTimeSlot[l]);
                    $(timeModule).append(timeModuleItem_others);
                    //return newTimeSlot;
                    //console.log('nTS: '+newTimeSlot[l]);
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
                //if(!guideDocked && ($(timeHeaderBar).offset().top - scrollTop() < 729) && ($(timeHeaderBar).offset().left < 1)){
                //if(!guideDocked && ($(timeHeaderBar).offset().top - scrollTop() < 729)){
                //if(!guideDocked){
                    //timeHeaderBar.style.top = 0;
                    //timeHeaderBar.style.position = 'fixed';
                    //timeHeaderBar.className = 'docked';
                    
                    console.log('auto: '+$(timeHeaderBar).offset().left);
                    //$(timeHeaderBar).attr('style', 'position:fixed');
                    $(timeHeaderBar).attr('style', 'position:fixed; left:'+$(timeHeaderBar).offset().left+'px;').next().attr('style', 'margin-top:33px');
                    //if($(timeHeaderBar).scrollLeft() > 0){
                    //    console.log('leftscroll: '+$(timeHeaderBar).scrollLeft());
                    //}
                    
                    /*
                    $scope.$watch( $(chnlGdeHldr).offset().left, function(evt){
                        this.$on('change', function(){
                            console.log('leftPos: '+$(chnlGdeHldr).offset().left);
                        })
                    })
                    */
                    
                    console.log('scroll: '+$(timeHeaderBar).scrollLeft());
                    //console.log('top: '+scrollTop());
                    //console.log('place: '+$(timeHeaderBar).offset().top);
                    guideDocked = true;
                    //} else if( guideDocked && scrollTop() <= guideTop ){
                    } /*
                    else if( guideDocked ){
                                             //timeHeaderBar.style.position = 'relative';
                                             //$(timeHeaderBar).attr('style', 'position:'+guideTop+'px');
                                             $(timeHeaderBar).attr('style', 'position:relative');
                                             
                                             //timeHeaderBar.className = timeHeaderBar.className.replace('docked', '');
                                        
                                            guideDocked = false;    
                                            }*/
                    
                
            });
            
            
            
            /// ALL USER CHANNELS AVAILABLE BELOW ///
            userSvc.getUserChannels(function (data) {
                $scope.dUserChannels = data;
                
                //console.log('leng: '+$scope.dUserChannels.length);
                
                angular.forEach($scope.dUserChannels, function( value, key ){
   
                    if(key < 8){
                        mediaSvc.getChannelGuide(value.live_external_id, value.identifier).success(function (channelView) {
                    
                        var dLogo = channelView[0].preferredImage.uri;
                        var dStation = channelView[0].callSign;
                        var inLineup = channelView[0].airings;
                        $scope.dChnlLnup = [];
                        $scope.dStation = channelView[0].callSign;
                        //console.log('station: '+dStation+' - amtShows: '+inLineup.length);
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
