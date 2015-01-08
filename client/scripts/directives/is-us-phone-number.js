(function (app) {
    'use strict';

    app.directive('isUsPhoneNumber', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function (phone) {
                    var regex = /^[(]{0,1}[2-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
                    var isPhone = regex.test(phone);
                    ctrl.$setValidity('isUsPhoneNumber', isPhone);
                    return phone;
                });
            }
        };
    }]);
}(angular.module('app')));
