(function (app){
	'use strict';
	
	app.directive('jwplayerDirective', function($log){
		return {
			restrict: 'A',
			replace: true,
			template: '<div><img ng-src="{{usrMnScrn.mnView}}" /></div>',
			link: function(scope, el, attrs){
				attrs.$set('testAttr', 'timing');
				attrs.$set('id', 'my-player');
				//$log.log('poster image submitted: '+el.html());
				//$log.log('ID attr set to: '+attrs.testAttr);
			}
		}
	});

}(angular.module('app')));