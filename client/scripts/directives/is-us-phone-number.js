(function (app) {
    'use strict';

    app.directive('isUsPhoneNumber', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                function validate(phone) {
                    var regex = /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{4}$/;
                    var isPhone = regex.test(phone);
                    ctrl.$setValidity('isUsPhoneNumber', isPhone);
                    return phone;
                }

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.unshift(validate);
            }
        };
    }]);
}(angular.module('app')));
