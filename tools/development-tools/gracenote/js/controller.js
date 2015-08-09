(function (myApp) {
    'use strict';
    
    var channelGuide;
    
    myApp.controller('channelGuideCtrl', ['$scope', 'channelGuideSvc', function ($scope, channelGuideSvc) {
        
        channelGuideSvc.getChannelGuide()
        .then(function(data) {
            var dates = [];
            for (var i = 0; i < data.channelsDB.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;
            $scope.channels = data.channelsDB;
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
            for (var i = 0; i < data.channelsDB.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;

            $scope.channels = data.channelsDB;
            
        })*/
    }]);
    
    myApp.controller('channelListCtrl', ['$scope', 'channelGuideSvc', function ($scope, channelGuideSvc) {
       
        var req = {stationIds: []};
        
        channelGuideSvc.getChannelList(
            req,
            function (data) {
                var dates = [];
                for (var i = 0; i < data.channelsDB.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                $scope.channels = data.channelsDB;
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
            for (var i = 0; i < data.channelsDB[$routeParams.stationid].airings.length; i++ ) {
                if (i % 5 == 0) dates.push([]);
                dates[dates.length-1].push(i);
            }
            
            $scope.dates = dates;
            $scope.channel = data.channelsDB[$routeParams.stationid];
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
        console.log('channelCtrl result: channel index '+$routeParams.stationid);
        
        channelSvc.setChannel($routeParams.stationid);
        
        var req = {stationId: '0', hour: true, period: 2};
        req.stationId = $routeParams.stationid;
        req.hour = true;
        req.period = 6;
        
        channelGuideSvc.getChannelInfo(
            req,
            function (data) {
                var dates = [];
                for (var i = 0; i < data.channelsDB.length; i++ ) {
                    if (i % 5 == 0) dates.push([]);
                    dates[dates.length-1].push(i);
                }
                
                $scope.dates = dates;
                $scope.channel = data.channelsDB;
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
            $scope.channelTitle = data.channelsDB[$routeParams.stationid].callSign;
            $scope.program = data.channelsDB[$routeParams.stationid].airings[$routeParams.programid];
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
        console.log('programCtrl result: channel index '+$routeParams.stationid+' and airings program index '+$routeParams.programid);
        $scope.channelId = $routeParams.stationid;
        
        var req = {tmsId: '0'};
        req.tmsid = $routeParams.programid;
        req.stationId = $routeParams.stationid;
        
        channelGuideSvc.getProgramDetail(
            req,
            function (data) {
                $scope.channelTitle = data.channelsDB.callSign;
                $scope.program = data.channelsDB.airings;
                console.log('channelGuideCtrl calls channelGuideSvc.getChannelGuide for program');
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

