(function (app) {
    'use strict';

    app.directive('complexPassword', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                function validate(password) {
                    if(password) {
                        var hasUpperCase = /[A-Z]/.test(password);
                        var hasNumbers = /\d/.test(password);
                        var characterGroupCount = hasUpperCase + hasNumbers;
                        ctrl.$setValidity('complexity', (password.length >= 6) && (characterGroupCount >= 2));
                        return password;
                    } else {
                        ctrl.$setValidity('complexity', true);
                        return password;
                    }
                }

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.unshift(validate);
            }
        };
    }]);
}(angular.module('app')));
