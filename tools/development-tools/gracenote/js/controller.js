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
       
        var req = {stationIds: [], projections: ['status', 'channel']};
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
        
        var req = {stationId: '0', period: undefined, projections: []};
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
        
        var req = {tmsId: '0', stationId: '0', projections: []};
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
        
        var req = {stationIds: []};
        //var req = {stationIds: ['44448']};//$routeParams.stationid;
        //var req = {stationIds: ['92197', '44448']};
        $scope.images = [];
        
        channelGuideSvc.getChannelLogo(
            req,
            function (data) {
                var images = data.split('$');
                
                var dates = [];
                for (var i = 0; i < images.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                
                for(var i = 0; i < images.length; i ++) {
                    $scope.images.push(images[i]);
                    console.log('channelLogoCtrl calls channelGuideSvc.getChannelLogo succeed with index: ' + i);
                }
                $scope.image = $scope.images[0];
            },
            function (error) {
                console.log(error);
            }
        );
        
        // test for program image
        var reqProgramImage = {uris: []};//$routeParams.stationid;
        //var reqProgramImage = {tmsIds: ['SH003701840000', 'SH009553500000', 'SH003513400000']}; // 'SH008986720000'
        //var reqProgramImage = {uris: ['assets/p472885_b_v5_ab.jpg', 'assets/p392712_b_v5_aa.jpg', 'assets/p10865466_b_v5_ab.jpg']}; // 'SH008986720000'
        $scope.programImages = [];
        
        channelGuideSvc.getProgramImage(
            reqProgramImage,
            function (data) {
                var images = data.split('$');
                
                var programDates = [];
                for (var i = 0; i < images.length; i++ ) {
                    if (i % 5 == 0) programDates.push([]);
                    programDates[programDates.length-1].push(i);
                }
                
                $scope.programDates = programDates;
                
                for(var i = 0; i < images.length; i ++) {
                    $scope.programImages.push(images[i]);
                    console.log('programImageCtrl calls channelGuideSvc.getProgramImage succeed with index: ' + i);
                }
                $scope.programImage = $scope.programImages[0];
            },
            function (error) {
                console.log(error);
            }
        );
    }]);
    
    myApp.controller('programImageCtrl', ['$scope', '$routeParams', 'channelGuideSvc', function ($scope, $routeParams, channelGuideSvc) {
        console.log('programImageCtrl result: tmsId '+$routeParams.tmsid);
        $scope.tmsId = $routeParams.tmsid;
        
        //var req = {stationIds: []};
        //var req = {tmsIds: []};//$routeParams.stationid;
        //var req = {tmsIds: ['SH012914400000', 'SH008986720000']}; // 'SH008986720000'
        var reqProgramImage = {uris: ['assets/p472885_b_v5_ab.jpg', 'assets/p392712_b_v5_aa.jpg', 'assets/p10865466_b_v5_ab.jpg']}; // 'SH008986720000'

        $scope.images = [];
        
        channelGuideSvc.getProgramImage(
            req,
            function (data) {
                var images = data.split('$');
                
                var dates = [];
                for (var i = 0; i < images.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                
                for(var i = 0; i < images.length; i ++) {
                    $scope.images.push(images[i]);
                    console.log('programImageCtrl calls channelGuideSvc.getProgramImage succeed with index: ' + i);
                }
                $scope.image = $scope.images[0];
            },
            function (error) {
                console.log(error);
            }
        );
    }]);
    
    myApp.controller('testCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/').success(function(data) {
            $scope.test = 'this test page';
        })
    }]);
}(angular.module('myApp')));

