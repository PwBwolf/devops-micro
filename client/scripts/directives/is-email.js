(function (app) {
    'use strict';

    app.directive('isEmail', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function (email) {
                    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                    var isEmail = regex.test(email);
                    ctrl.$setValidity('isEmail', isEmail);
                    return email;
                });
            }
        };
    }]);
}(angular.module('app')));
