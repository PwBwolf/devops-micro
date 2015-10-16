(function (app) {
    'use strict';

    app.directive('validName', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                function validate(name) {
                    var regex = /^[a-zA-Z0-9\s\-,.']+$/;
                    var isName = regex.test(name);
                    ctrl.$setValidity('validName', isName);
                    return name;
                }

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.unshift(validate);
            }
        };
    }]);
}(angular.module('app')));
