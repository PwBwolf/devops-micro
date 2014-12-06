﻿(function (app) {
    'use strict';

    app.directive('notSameAs', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',

            link: function (scope, elem, attrs, ctrl) {
                // if ngModel is not defined, we do nothing
                if (!ctrl) {
                    return;
                }
                if (!attrs['notSameAs']) {
                    return;
                }
                scope.$watch(attrs.notSameAs, function (value) {
                    // the second value is not set yet, we do nothing
                    if (ctrl.$viewValue === undefined || ctrl.$viewValue === '') {
                        return;
                    }
                    ctrl.$setValidity('notSameAs', value !== ctrl.$viewValue);
                });
                ctrl.$parsers.push(function (value) {
                    var isValid = value !== scope.$eval(attrs.notSameAs);
                    ctrl.$setValidity('notSameAs', isValid);
                    return isValid ? value : undefined;
                });
            }
        };
    }]);
}(angular.module('app')));
