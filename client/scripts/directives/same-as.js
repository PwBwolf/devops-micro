(function (app) {
    'use strict';

    app.directive('sameAs', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',

            link: function (scope, elem, attrs, ctrl) {
                // if ngModel is not defined, we do nothing
                if (!ctrl) {
                    return;
                }
                if (!attrs['sameAs']) {
                    return;
                }
                scope.$watch(attrs.sameAs, function (value) {
                    // the second value is not set yet, we do nothing
                    if (ctrl.$viewValue === undefined || ctrl.$viewValue === '') {
                        return;
                    }
                    ctrl.$setValidity('sameAs', value === ctrl.$viewValue);
                });
                ctrl.$parsers.push(function (value) {
                    if(!value) {
                        return false;
                    }
                    var isValid = value === scope.$eval(attrs.sameAs);
                    ctrl.$setValidity('sameAs', isValid);
                    return isValid ? value : undefined;
                });
            }
        };
    }]);
}(angular.module('app')));
