(function (app) {
    'use strict';

    app.directive('closePanel', ['$', function ($) {
        return {
            restrict: 'E',
            replace: true,
            template: '<span ng-show="closeVisible"></span>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'closeBtn');
                attrs.$set('class', 'close-btn label label-danger');
                element.text('CLOSE');
                scope.closeVisible = true;
                element.bind('click', function () {
                    $(scope.smm).switchClass('suggested-channels', 'suggested-channels', 500, 'easeInOutQuad');
                    $(scope.player).switchClass('player-minimized', 'player-maximized', 500, 'easeInOutQuad');
                    $(scope.qlBox).toggleClass('off');
                    $(scope.channels).attr('class', 'channel-panel');
                    scope.isVisible = false;
                    scope.closeVisible = false;
                    scope.logoVisible = false;
                });
            }
        };
    }]);
}(angular.module('app')));
