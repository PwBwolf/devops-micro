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
            
            $scope.stations = [{id: '47620', name: 'TELESUR', color: 'burlywood'}, {id: '44448', name: 'CENTROA', color: 'cadetblue'}, {id: '55912', name: 'TRO', color: 'darkgrey'}, {id: '65269', name: 'CSMOTV', color: 'darksalmon'}], {id: '59350', name: 'JBN', color: 'goldenrod'}
            var dt = $filter('date')(new Date(), 'h:00 a');
            console.log('dt: '+dt);
            
            $scope.getTimeSlot = function (){
                var timeSlot = new Date();
                //var timeSlot = new Date(timeSlot.getTime() + (60 * 60 * 1000));
                var timeSlot = $filter('date')( new Date(timeSlot.getTime() + (60 * 60 * 1000)), 'h:00 a');
                //return pad(timeSlot.getHours())+ ':' +pad(timeSlot.getMinutes());
                //return pad(timeSlot.getHours())+ ':00'; 
                //$scope.getNextTimeSlot(timeSlot);
                return timeSlot;
            };
            
            /*
            $scope.getNextTimeSlot = function (dt){
                            var crntSlot = new Date();
                            for (var l = 2; l < 12; l++ ){
                                var cnt = 60 * l ;
                                var newTimeSlot = $filter('date')(new Date(crntSlot.getTime() + (cnt * 60 * 1000)), 'h:00 a');
                                //console.log('logtime: '+cnt);
                                //var nextTimeSlot = new Date(timeSlot.getTime() + (60 * 60 * 1000));
                                //var nextTimeSlot = $filter('date')( new Date(timeSlot.getTime() + (60 * 60 * 1000)), 'h:00 a');
                                //return pad(nextTimeSlot.getHours())+ ':' +pad(nextTimeSlot.getMinutes());
                                //return pad(nextTimeSlot.getHours())+ ':00'; 
                                console.log('timeslot: '+newTimeSlot);
                                //return newTimeSLot;
                                
                                //$(timeModule).append(timeModuleItem_others)[l];  
                            };
                            
                        };*/
            
            
            
            
            /// ALL USER CHANNELS AVAILABLE BELOW ///
            userSvc.getUserChannels(function (data) {
                $scope.userChannels = data;
                

            });
            /////////////////////////////////////////
            
            
            mediaSvc.getChannels('david', function(mydata){
                console.log('mine: '+mydata.length);
            });
            
            $scope.logoVisible = false;
            $scope.loadingStations = true;
            //for (var p in $scope.stations){
            var chnlGdeHldr = angular.element('#channelGuidePanel');
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
                    //console.log('logtime: '+cnt);
                    //var nextTimeSlot = new Date(timeSlot.getTime() + (60 * 60 * 1000));
                    //var nextTimeSlot = $filter('date')( new Date(timeSlot.getTime() + (60 * 60 * 1000)), 'h:00 a');
                    //return pad(nextTimeSlot.getHours())+ ':' +pad(nextTimeSlot.getMinutes());
                    //return pad(nextTimeSlot.getHours())+ ':00'; 
                    //console.log('timeslot: '+newTimeSlot[l]);
                    //return newTimeSLot;
                    
                    //$(timeModule).append(timeModuleItem_others)[l];
                    //var timeElement = angular.element(document.createElement('li'));
                    //$(timeElement).attr('class', 'timeModuleItem').html('callstack');
                    //$(timeModule).append(timeElement);
                    
                    var timeModuleItem_others = angular.element(document.createElement('li'));
                    $(timeModuleItem_others).attr('class', 'timeModuleItem').html(newTimeSlot[l]);
                    $(timeModule).append(timeModuleItem_others);
                    //return newTimeSlot;
                    console.log('nTS: '+newTimeSlot[l]);
                };
                //return newTimeSlot;
                
            };
            $scope.getNextTimeSlot();
            //$(timeModule).prepend(timeModuleItem_first).append(timeModuleItem_others);
            //$(timeModule).append(timeModuleItem_others);
            $(timeHeaderBar).append(timeModule);
            //console.log('usr: '+thisData);
            
            
            angular.forEach($scope.stations, function(value, key) {
            //angular.forEach($scope.userChannels[0], function( value, key){
                console.log('name: '+value.id+ ' | id: '+value.name+' key: '+key);
                
                mediaSvc.getChannelGuide(value.id, value.name).success(function (channelView) {
                    
                    var dLogo = channelView[0].preferredImage.uri;
                    var dStation = channelView[0].callSign;
                    var inLineup = channelView[0].airings;
                    $scope.dChnlLnup = [];
                    
                    console.log('station: '+dStation+' - amtShows: '+inLineup.length);
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
                            console.log('chnl: '+dStation+' - title: '+data.program.title+' dur: '+data.duration+' sT: '+dShowStartTime+' hour: '+dt+':00 - nexthour: '+dNextTimeSlot);
                            
                            
                            /// comment out the if statement line to view all shows and times ///
                            //if( dShowStartTime > firstShowTime && dShowEndTime <= dNextTimeSlot){
                                $scope.ChannelLineup = '<div style="width:'+$scope.timeSpan(data.duration)+'"><img src="'+$scope.getImage(data.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + data.program.title + '</span></p>';
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
                
            });
            
            /// ==== OPTIONS END ==== ///
            /// ===================== ///
            
            
            $scope.timeSpan = function(time){
                //var timeS = time * 2+'px';
                $scope.timeS = time * 4+'px';
                console.log('span: '+$scope.timeS);
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
            
		}
        
    /// ============ INIT END ============ /// 
        
        
        $scope.prvwPnl = function(index){
            
            //var thisBrandImage = angular.element('#channelBrand').attr('class');
            // var thisBrandImage = angular.element('#channelBrand');
                 //$scope.$watch( $(thisBrandImage).attr('class'), function(evt){
                 //    this.$on('change', )
                 //})

            //console.log('brand: '+thisBrandImage);
            //var thisPreviewPnl = $window.document.getElementById('channelPreviewPanel').getElementsByTagName('div')[0];
            $scope.thisPreviewPnl = angular.element('channelPreviewPanel').find('div:first-child');
                $scope.thisPreviewPnl.bind('click', function(evt){
                    //$scope.playChannel(index);
                    console.log('done');
                });
                //console.log('prvw html: '+$(thisPreviewPnl).html());   ///closest('div').html());
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
        
        /*
        $scope.getTimeSlot = function (){
                    var timeSlot = new Date();
                    var nextTimeSlot = new Date(timeSlot.getTime() + (60 * 60 * 1000));
                    //return pad(nextTimeSlot.getHours())+ ':' +pad(nextTimeSlot.getMinutes());
                    return pad(nextTimeSlot.getHours())+ ':00'; 
                };*/
        

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
            if(uri.indexOf('/images/channels/') === 0) {
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
            
            /*if(!chnl.program.shortDescription) {
                ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Description: </span><span class="channel-details-body">Not Available</span></p></div>';
                } else {
                    ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Description: </span><span class="channel-details-body">' + chnl.program.shortDescription + '</span></p></div>';
            }*/
           
            return ChannelLineup;
        };
		       
    }])
    .directive('channelLineup', function($log, $window, $compile){
            return {
                restrict: 'A',
                replace: true,
                //template: '<div data-ng-bind-html=dChnlLnup></div>',
                template: '<div></div>',
                link: function(scope, el, attrs){
                    //var template = '<div data-ng-bind-html=dChnlLnup></div>';
                    //var linkShow = $compile(template);
                    //var dCntnt = linkShow(scope);
                    //el.append(dCntnt);
                    //attrs.$set('data-ng-bind-html', 'dChnlLnup');
                
                    //var dShow = [];
                        //dShow = el.find('div');
                    
                
                    //$(dShow).attr('width', ''+scope.timeS);
                    //scope.v = scope.inLineup.length;
                    //for(var k in v){
                    
                    //}
                    attrs.$set('class', 'chnlDesc');
                    //attrs.$set('style', 'width:'+timeSpan);
                    attrs.$set('id', 'channelGuideDesc');
                    //console.log('shows: '+dShow.length);
                }
            }
    });
}(angular.module('app')));
