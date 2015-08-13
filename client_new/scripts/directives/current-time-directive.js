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
                var dt = $filter('date')(new Date(), 'h:mm:ss a');
                element.text(dt);
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


/*return {
	restrict: 'A',
	//replace: true,
	//template: '<div><img ng-src="{{usrMnScrn.mnView}}" /></div>',
	link: function(scope, el, attrs){
		attrs.$set('testAttr', 'timing');
		attrs.$set('id', 'my-player');
		//$log.log('poster image submitted: '+el.html());
		//$log.log('ID attr set to: '+attrs.testAttr);
	}
}*/