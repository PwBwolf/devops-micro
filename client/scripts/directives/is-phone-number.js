(function (app) {
    'use strict';

    app.directive('isPhoneNumber', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (!viewValue) {
                        ctrl.$setValidity('isPhoneNumber', true);
                        return viewValue;
                    }
                    var test1 = /^\+?\d{10,20}$/.test(viewValue);
                    var test2 = /^\(?\d{3}\)?[- \.]?\d{3}[- \.]?\d{4}$/.test(viewValue);
                    var isValid = test1 || test2;
                    ctrl.$setValidity('isPhoneNumber', isValid);
                    return viewValue;
                });
            }
        };
    }]);
}(angular.module('app')));
