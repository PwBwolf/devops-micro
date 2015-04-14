(function (app) {
    'use strict';

    app.directive('autofocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $timeout(function () {
                    $element[0].focus();
                });

                if ($attrs.focusWatch && $attrs.focusValue) {
                    $scope.$watch($attrs.focusWatch, function (newValue) {
                        if (newValue.toString() === $attrs.focusValue) {
                            $timeout(function () {
                                $element[0].focus();
                            }, 100);
                        }
                    }, true);
                }
            }
        };
    }]);
}(angular.module('app')));
