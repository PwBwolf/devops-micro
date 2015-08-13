(function (app) {
    'use strict';

    app.controller('homeChnlsCtrl', ['$scope', '$', 'homeChnlsSvc', '$filter', '$window', function ($scope, $, homeChnlsSvc, $filter, $window) {
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
        $scope.mrqeData = [];
		
        $scope.counter = 0;
        
		//$scope.dUser = $scope.user;
		//console.log('dFirstName: '+dUser);
		
		init();
		function init(){
            $scope.now = $filter('date')(new Date(), 'HH:mm a');
            $scope.format = $filter('date')(new Date(), 'HH:mm a');
            //$scope.now = ;
            //console.log($scope.now+' itis.');
            
			$scope.dUser = $scope.user;
			$scope.usrData = homeChnlsSvc.getUsrData();
			$scope.usrPrfrdChnls = homeChnlsSvc.getPrfrdChnls();
            $scope.mrqeData = homeChnlsSvc.getMarqueeData();
            
            
            /*
            var scrollBox = $window.document.getElementById("my_text");
            var text = [];
            for (var m in $scope.mrqeData){
                if($scope.mrqeData.length > 0){
                    text[m] = $scope.mrqeData[m].message;
                } else {
                    text = "Thank you for signing up for yiptv";
                }
                
                console.log(counter);

            }
            
            
            setInterval(change, 5000);
            function change() {
                scrollBox.innerHTML = text[counter];
                counter++;
                
                if(counter >= text.length) { counter = 0; }
            }
            */
            
            var text = $scope.mrqeData;
            setInterval(change, 5000);
            function change() {
                //attrs.$set('translate', 'text[counter]');
                //scrollBox.innerHTML = text[counter];
            
                //$(scrollBox).attr('ng-translate', text[counter]);
                //scope.crntMrqe(counter);
                $scope.counter++;
            
                if($scope.counter >= text.length) { $scope.counter = 0; }
                //console.log($scope.counter);
            }
            
		}
        $scope.slctdMrqe = -1;
        
        $scope.crntMrqe = function (counter) { $scope.slctdMrqe = counter; }		
        $scope.isVisible = false;
        
        
        
        //var text = $scope.mrqeData;
        //console.log(text.length);
        //setInterval(change, 5000);
        //function change() {
            //attrs.$set('translate', 'text[counter]');
            //scrollBox.innerHTML = text[counter];
            
            //$(scrollBox).attr('ng-translate', text[counter]);
            //scope.crntMrqe(counter);
           // $scope.isVisible = true;
            
          //  counter++;
            
            //if(counter >= text.length) { counter = 0; }
            //console.log(counter);
            //}
        

    }]);
}(angular.module('app')));
