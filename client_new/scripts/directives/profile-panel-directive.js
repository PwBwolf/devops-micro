(function (app){
	'use strict';
	
	app.directive('prflPnlDirective', function($log){
		return {
			restrict: 'A',
			replace: true,
			//scope: {},
			//controller: '@',
			//name: 'controllerName',
			template: '<div data-ng-include="{{slctdPnl.include}}"></div>',
			link: function(scope, el, attrs){
				//attrs.$set('data-ng-show', 'prflItmSlctd(($index == slctdPrflItm) ? \'true\' : \'false\')');
				//attrs.$set('id', 'usrDataFile.{{slctdPnl.pnlID}}');
				//attrs.$set('controller-name="showDescCtrl"');
				//$log.log('poster image submitted: '+el.html());
				//$log.log('Include attr set to: '+attrs.testAttr);
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