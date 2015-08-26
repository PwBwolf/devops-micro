(function (myApp) {
    'use strict';
    
    var channelGuide;
    
    myApp.controller('channelGuideCtrl', ['$scope', 'channelGuideSvc', function ($scope, channelGuideSvc) {
        
        channelGuideSvc.getChannelGuide()
        .then(function(data) {
            var dates = [];
            for (var i = 0; i < data.channelsDb.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;
            $scope.channels = data.channelsDb;
            console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });
        
        /*
        $http.get('/channelguide').success(function(data) {
            channelGuide = data;
            var dates = [];
            for (var i = 0; i < data.channelsDb.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;

            $scope.channels = data.channelsDb;
            
        })*/
    }]);
    
    myApp.controller('appConfigCtrl', ['$scope', 'channelGuideSvc', function ($scope, channelGuideSvc) {
        
        channelGuideSvc.getAppConfig()
        .then(function(data) {
            $scope.graceNoteImageUrl = data.appConfig.graceNoteImageUrl;
            console.log('appConfigCtrl calls channelGuideSvc.getAppConfig to get graceNoteImageUrl');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });
    }]);
    
    myApp.controller('channelListCtrl', ['$scope', 'channelGuideSvc', function ($scope, channelGuideSvc) {
       
        var req = {stationIds: []};
        //var req = {stationIds: ['44448', '55912']};
    /*    
        channelGuideSvc.getAppConfig()
        .then(function(data) {
            $scope.graceNoteImageUrl = data.graceNoteImageUrl;
            console.log('channelListCtrl calls channelGuideSvc.getAppConfig');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });
    */    
        channelGuideSvc.getChannelList(
            req,
            function (data) {
                var dates = [];
                for (var i = 0; i < data.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                $scope.channels = data;
                console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide');
            },
            function (error) {
                console.log(error);
            }
        );

    }]);
    
    myApp.controller('channelCtrl', ['$scope', '$routeParams', 'channelGuideSvc', 'channelSvc', function ($scope, $routeParams, channelGuideSvc, channelSvc) {
        console.log('channelCtrl result: channel index '+$routeParams.stationid);
        
        channelSvc.setChannel($routeParams.stationid);
        channelGuideSvc.getChannelGuide()
        .then(function(data) {
            var dates = [];
            for (var i = 0; i < data.channelsDb[$routeParams.stationid].airings.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;
            $scope.channel = data.channelsDb[$routeParams.stationid];
            $scope.channelid = $routeParams.stationid;
            console.log('airings length: '+$scope.channel.airings.length);
            console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide for channel');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });		
    }]);
    
    myApp.controller('channelInfoCtrl', ['$scope', '$routeParams', 'channelGuideSvc', 'channelSvc', function ($scope, $routeParams, channelGuideSvc, channelSvc) {
        console.log('channelInfoCtrl result: channel index '+$routeParams.stationid);
        
        channelSvc.setChannel($routeParams.stationid);
        
        var req = {stationId: '0', period: undefined};
        req.stationId = $routeParams.stationid;
        req.period = undefined;
    /*    
        channelGuideSvc.getAppConfig()
        .then(function(data) {
            $scope.graceNoteImageUrl = data.graceNoteImageUrl;
            console.log('channelListCtrl calls channelGuideSvc.getAppConfig');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });
    */    
        channelGuideSvc.getChannelInfo(
            req,
            function (data) {
                var dates = [];
                for (var i = 0; i < data.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                $scope.channel = data;
                $scope.channelid = $routeParams.stationid;
                console.log('airings length: '+$scope.channel.length);
                console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide for channel airings');
            },
            function (error) {
                console.log(error);
            }    
        );
        
    }]);
    
    myApp.controller('preProgramCtrl', ['$routeParams', '$location', 'channelSvc', function ($routeParams, $location, channelSvc) {
        console.log('preProgramCtrl result: airings program index '+$routeParams.programid);
        var channelid = channelSvc.getChannel();
        console.log('channel id: '+channelid);
        var newUrl = 'channelguide/'+channelid+'/'+$routeParams.programid;
        $location.url(newUrl);		
    }]);
    
    myApp.controller('programCtrl', ['$scope', '$routeParams', 'channelGuideSvc', function ($scope, $routeParams, channelGuideSvc) {
        console.log('programCtrl result: channel index '+$routeParams.stationid+' and airings program index '+$routeParams.programid);
        $scope.channelId = $routeParams.stationid;
        channelGuideSvc.getChannelGuide()
        .then(function(data) {
            $scope.channelTitle = data.channelsDb[$routeParams.stationid].callSign;
            $scope.program = data.channelsDb[$routeParams.stationid].airings[$routeParams.programid];
            console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide for program');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });		
    }]);
    
    myApp.controller('programDetailCtrl', ['$scope', '$routeParams', 'channelGuideSvc', function ($scope, $routeParams, channelGuideSvc) {
        console.log('programCtrl result: channel index '+$routeParams.stationid);
        $scope.channelId = $routeParams.stationid;
        
        var req = {tmsId: '0', stationId: '0'};
        req.tmsId = $routeParams.programid;
        req.stationId = $routeParams.stationid;
        //req.startTime = $routeParams.starttime;
    /*    
        channelGuideSvc.getAppConfig()
        .then(function(data) {
            $scope.graceNoteImageUrl = data.graceNoteImageUrl;
            console.log('channelListCtrl calls channelGuideSvc.getAppConfig');

        }, function(res) {
            if(res.status === 500) {
                console.log(res.status);
            } else { 
                console.log(res.status);
            }
        });
    */    
        channelGuideSvc.getProgramDetail(
            req,
            function (data) {
                $scope.channelTitle = data.callSign;
                $scope.program = data.airings;
                console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide for program');
            },
            function (error) {
                console.log(error);
            }
        );
    
    }]);
    
    myApp.controller('channelLogoCtrl', ['$scope', '$routeParams', 'channelGuideSvc', function ($scope, $routeParams, channelGuideSvc) {
        console.log('channelLogoCtrl result: channel index '+$routeParams.stationid);
        $scope.channelId = $routeParams.stationid;
        
        //var req = {stationIds: []};
        var req = {stationIds: []};//$routeParams.stationid;
        //var req = {stationIds: ['92197']};
        $scope.images = [];
        
        channelGuideSvc.getChannelLogo(
            req,
            function (data) {
                var images = data.split('$');
                
                var dates = [];
                for (var i = 0; i < images.length-1; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                
                for(var i = 1; i < images.length; i ++) {
                    $scope.images.push(images[i]);
                    console.log('channelLogoCtrl calls channelGuideSvc.getChannelLogo succeed with index: ' + i);
                }
                $scope.image = $scope.images[0];
            },
            function (error) {
                console.log(error);
            }
        );
        
        /*
        var req = {stationIds: []};
        channelGuideSvc.getChannelList(
            req,
            function (data) {
                var request = {stationId: null};
                for (var i = 0; i < data.length; i++ ) {
                    request.stationId = data[i].stationId;
                    channelGuideSvc.getChannelLogo(
                        request,
                        function (image) {
                            $scope.image = image;
                            console.log('channelLogoCtrl calls channelGuideSvc.getChannelLogo succeed');
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
                    setTimeout(function(){
                        console.log('Display channel logo');
                    }, 5000);
                }
            },
            function (error) {
                console.log(error);
            }
        );
    */
    }]);
    myApp.controller('testCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/').success(function(data) {
            $scope.test = 'this test page';
        })
    }]);
}(angular.module('myApp')));

