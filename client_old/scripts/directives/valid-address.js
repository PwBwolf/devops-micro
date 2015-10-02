(function (app) {
    'use strict';

    app.directive('validAddress', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                function validate(address) {
                    var regex = /^[a-zA-Z0-9\u00C0-\u017F\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/;
                    var isAddress = regex.test(address);
                    ctrl.$setValidity('validAddress', isAddress);
                    return address;
                }

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.unshift(validate);
            }
        };
    }]);
}(angular.module('app')));
