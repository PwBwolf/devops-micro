(function (app) {
    'use strict';

    app.controller('homeChnlGuideCtrl', ['$scope', '$', 'homeChnlGuideSvc', 'mediaSvc', '$compile', function ($scope, $, homeChnlGuideSvc, mediaSvc, $compile) {

		init();
		function init(){
			$scope._12pm = homeChnlGuideSvc.getGdeData1();
			$scope._1pm = homeChnlGuideSvc.getGdeData2();
			$scope._2pm = homeChnlGuideSvc.getGdeData3();
			$scope._3pm = homeChnlGuideSvc.getGdeData4();
			$scope._4pm = homeChnlGuideSvc.getGdeData5();
			$scope._5pm = homeChnlGuideSvc.getGdeData6();
			$scope._6pm = homeChnlGuideSvc.getGdeData7();
            
            $scope.stations = [{id: '47620', name: 'TELESUR', color: 'burlywood'}, {id: '44448', name: 'CENTROA', color: 'cadetblue'}, {id: '55912', name: 'TRO', color: 'darkgrey'}, {id: '65269', name: 'CSMOTV', color: 'darksalmon'}, {id: '59350', name: 'JBN', color: 'goldenrod'}];
            //angular.forEach(stations, function(value, key) {
            //  this.push(key + ': ' + value);
            //});
            $scope.logoVisible = false;
            $scope.loadingStations = true;
            //for (var p in $scope.stations){
            var chnlGdeHldr = angular.element('#channelGuidePanel');
            
            
            /// ==== OPTION ONE ==== ///
            /// ==================== ///
            /*
            for( var p in $scope.stations ){
                console.log('name: '+$scope.stations[p].name+ ' | id: '+$scope.stations[p].id+' key: '+p);
                
                mediaSvc.getChannelGuide($scope.stations[p].id, $scope.stations[p].name).success(function (channelView){
                    $scope.inLineup = channelView[0].airings;
                    $scope.dChnlLnup = [];
                    for (var s in $scope.inLineup){
                        
                         // working for displaying all channels // 
                        if( $scope.inLineup.length <= 1 ){
                            console.log('only one airing');
                            
                        } else {
                            var chnlGde = [], linkShow = [], dCntnt = [];
                            //var chnlGdeHldr = angular.element('#channelGuidePanel');
                                chnlGde = angular.element(document.createElement('div'));
                                $(chnlGde).attr('channel-lineup', '');
                            
                            $scope.dChnlLnup[s] = $scope.getChannelLineup($scope.inLineup[s]);
                            $scope.timeSpan($scope.inLineup[s].duration);
                            
                            dCntnt = $compile(chnlGde)($scope);
                            
                            angular.element(chnlGdeHldr).append(dCntnt[s]);
                            
                        }

                    }
                    $scope.loadingStations = false;
                }).error(function() {
                    $scope.loadingStations = false;
                    loggerSvc.logError('Error loading tv channel guide.');
                });
                
            }
            */
            
            /// ==== OPTION TWO ==== ///
            /// ==================== ///
            
            angular.forEach($scope.stations, function(value, key) {
                console.log('name: '+value.name+ ' | id: '+value.id+' key: '+key);
                
                mediaSvc.getChannelGuide(value.id, value.name).success(function (channelView) {
                    
                    var dStation = channelView[0].callSign;
                    var inLineup = channelView[0].airings;
                    $scope.dChnlLnup = [];
                    
                    console.log('station: '+dStation+' - amtShows: '+inLineup.length);
                    var chnlGde = [], linkShow = [], dCntnt = [];
                    //var chnlGdeHldr = angular.element('#channelGuidePanel');
                        
                        //chnlGde = angular.element(document.createElement('div'));
                        //$(chnlGde).attr('id', dStation);
                        //angular.element(chnlGdeHldr).append(chnlGde);
                        /*
                        angular.forEach(inLineup, function(data){
                            console.log('chnl: '+dStation+' - title: '+data.program.title+' time#'+data.duration);
                        
                        })
                        */
                        setChannelLineup();
                      
                    function setChannelLineup(){
                        chnlGde = angular.element(document.createElement('div'));
                        $(chnlGde).attr('chnl', dStation);
                        angular.forEach(inLineup, function(data){
                            //console.log('chnl: '+dStation+' - title: '+data.program.title+' time#'+data.duration);
                            $scope.ChannelLineup = '<div style="width:'+$scope.timeSpan(data.duration)+'"><img src="'+$scope.getImage(data.program.preferredImage.uri)+'" /><p style="text-align: left;"><span class="channel-details-header">Title: </span><span class="channel-details-body">' + data.program.title + '</span></p>';
                            if(!data.duration && !data.startTime) {
                                $scope.ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">Not Available</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">Not Available</span></p>';
                                } else {
                                    $scope.ChannelLineup += '<p style="text-align: left"><span class="channel-details-header">Time: </span><span class="channel-details-body">' + $scope.getTime(1, data) + '</span>&nbsp;<span class="channel-details-header">Duration: </span><span class="channel-details-body">' + data.duration + ' min</span></p></div>';
                            } 
                            //return ChannelLineup;
                            
                            //$scope.dChnlLnup = $scope.getChannelLineup(data);
                            $(chnlGde).append($scope.ChannelLineup);
                            //console.log(ChannelLineup);
                            //$(chnlGde).attr('channel-lineup','');
                            //return $scope.ChannelLineup;
                            $(chnlGde).attr('class', 'chnlDesc');
                            //attrs.$set('style', 'width:'+timeSpan);
                            $(chnlGde).attr('id', 'channelGuideDesc');
                            
                        });
                        //$(chnlGde).append($scope.ChannelLineup);
                        //dCntnt = $compile(chnlGde)($scope);
                        angular.element(chnlGdeHldr).append(chnlGde);
                    }
                    
                    
                    /*
                    function setChannelLineup(){
                        chnlGde = angular.element(document.createElement('div'));
                        $(chnlGde).attr('chnl', dStation);
                        //angular.forEach(inLineup, function(data){
                        for(var b in inLineup){
                            //console.log('chnl: '+dStation+' - title: '+data.program.title+' time#'+data.duration);
                            $scope.dChnlLnup = $scope.getChannelLineup(data);
                            $(chnlGde).attr('channel-lineup','');
                            
                        };
                        dCntnt = $compile(chnlGde)($scope);
                        angular.element(chnlGdeHldr).append(chnlGde);
                    }
                    */
                    
                    /*for (var s in $scope.inLineup){
                        
                         // working for displaying all channels // 
                        if( $scope.inLineup.length <= 1 ){
                            console.log('only one airing');
                            
                        } else {
                            var chnlGde = [], linkShow = [], dCntnt = [];
                            //var chnlGdeHldr = angular.element('#channelGuidePanel');
                                chnlGde = angular.element(document.createElement('div'));
                                $(chnlGde).attr('channel-lineup', '');
                            
                            $scope.dChnlLnup[s] = $scope.getChannelLineup($scope.inLineup[s]);
                            $scope.timeSpan($scope.inLineup[s].duration);
                            
                            dCntnt = $compile(chnlGde)($scope);
                            
                            angular.element(chnlGdeHldr).append(dCntnt[s]);
                            
                        }

                    }*/
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
                $scope.timeS = time * 2+'px';
                //console.log('span: '+$scope.timeS);
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
