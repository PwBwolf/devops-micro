(function (app){
	'use strict';
	
	app.directive('showDescDirective', function($log){
		return {
			restrict: 'E',
			replace: true,
			//scope: {},
			//controller: '@',
			//name: 'controllerName',
			template: '<div><img data-ng-src="{{usrSubScrn.subView}}" data-ng-click="getTest()" /></div>',
			link: function(scope, el, attrs){
				attrs.$set('testAttr', 'timing');
				//attrs.$set('id', 'shw-desc-vwr');
				attrs.$set('id', 'my-player');
				//attrs.$set('controller-name="showDescCtrl"');
				//$log.log('poster image submitted: '+el.html());
				//$log.log('ID attr set to: '+attrs.testAttr);
			}
		}
	})
	/*
	.controller('showDescCtrl', ['$scope', 'homeScrnsSvc', function($scope, homeScrnsSvc){
		$scope.usrSubScrn = {};
		
		init();
		function init(){
			$scope.usrSubScrn = homeScrnsSvc.getUsrSubData();
		}
		
		$scope.getTest = function($scope){
			alert("just fondle");
		};
		console.log('hi: '+$scope.usrSubScrn.subChnl);
	}])
	*/
}(angular.module('app')));