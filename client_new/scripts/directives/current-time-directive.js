(function (app){
	'use strict';
	
	app.directive('currentTime', function($filter){
		return function(scope, element, attrs){
            var format;
        
            scope.$watch(attrs.myCurrentTime, function(value) {
                format = value;
                updateTime();
            });
        
            function updateTime(){
                var t = $filter('date')(new Date(), 'h:mm:ss a');
                element.text(t);
                //console.log(dt+' times');
            }
        
            function updateLater() {
                setTimeout(function() {
                  updateTime(); // update DOM
                  updateLater(); // schedule another update
                }, 1000);
            }
        
            updateLater();
        }
	});

}(angular.module('app')));
