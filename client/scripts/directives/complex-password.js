(function (app) {
    'use strict';

    app.directive('complexPassword', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (password) {
                    var hasUpperCase = /[A-Z]/.test(password);
                    var hasLowerCase = /[a-z]/.test(password);
                    var hasNumbers = /\d/.test(password);
                    var hasNonAlphas = /\W|_/.test(password);
                    var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas;
                    ctrl.$setValidity('complexity', (password.length >= 8) && (characterGroupCount > 3));
                    return password;
                });
            }
        };
    }]);
}(angular.module('app')));
