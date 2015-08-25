(function (app) {
    'use strict';

    app.directive('closePanel', ['$', function ($) {
        return {
            restrict: 'E',
            replace: true,
            template: '<span ng-show="closeVisible" ng-click="hideCloseButton()"></span>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'closeBtn');
                attrs.$set('class', 'close-btn label label-danger');
                element.text('X');
                scope.closeVisible = true;
                element.bind('click', function () {
                    $(scope.channelList).removeClass('channel-panel-max');
                    $(scope.channelList).addClass('channel-panel');
                });
            }
        };
    }]);
}(angular.module('app')));
