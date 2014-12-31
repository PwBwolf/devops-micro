(function (app) {
    'use strict';

    app.directive('isEmail', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function (email) {
                    var isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
                    ctrl.$setValidity('isEmail', isEmail);
                    return email;
                });
            }
        };
    }]);
}(angular.module('app')));
