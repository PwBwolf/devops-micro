(function (app) {
    'use strict';
app.directive('complexPassword', [function() {

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(password) {
                var hasUpperCase = /[A-Z]/.test(password);
                var hasLowerCase = /[a-z]/.test(password);
                var hasNumbers = /\d/.test(password);
                var hasNonAlphas = /\W/.test(password);
                var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas;
                if ((password.length >= 8) && (characterGroupCount > 3)) {
                    ctrl.$setValidity('complexity', true);
                    return password;
                } else {
                    ctrl.$setValidity('complexity', false);
                    return undefined;
                }
            });
        }
    };
}]);
}(angular.module('app')));
