(function (app){
	'use strict'
	console.log('hello')
	app.controller('epgCtrl', ['$scope', '$rootScope', '$', '$q', '$timeout', 'mediaSvc', '$filter', '$compile', function ($scope, $rootScope, $, $q, $timeout, mediaSvc, $filter, $compile) {
		console.log('epgCtrl loaded')
		$scope.blah = 'this is a string for testing'
	}])

}(angular.module('app')));