(function (app) {
    'use strict';

    app.directive('validEmailList', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function (emailList) {
                    var emails = emailList.split(',');
                    console.dir(emails);
                    for (var i = 0; i < emails.length; i++) {
                        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                        console.log(emails[i].trim());
                        var isEmail = regex.test(emails[i].trim());
                        console.log(isEmail);
                        if (!isEmail) {
                            ctrl.$setValidity('validEmailList', false);
                            return emailList;
                        }
                    }
                    ctrl.$setValidity('validEmailList', true);
                    return emailList;
                });
            }
        };
    }]);
}(angular.module('app')));
