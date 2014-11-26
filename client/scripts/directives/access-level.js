(function (app) {
    'use strict';

    app.directive('yipAccessLevel', ['authSvc', function (authSvc) {
        return {
            restrict: 'A',

            link: function ($scope, element, attrs) {
                var prevDisplay = element.css('display'),
                    userRole,
                    accessLevel;

                $scope.user = authSvc.user;

                $scope.$watch('user', function (user) {
                    if (user.role) {
                        userRole = user.role;
                    }
                    updateCss();
                }, true);

                attrs.$observe('accessLevel', function (al) {
                    if (al) {
                        accessLevel = $scope.$eval(al);
                    }
                    updateCss();
                });

                function updateCss() {
                    if (userRole && accessLevel) {
                        if (!authSvc.authorize(accessLevel, userRole)) {
                            element.css('display', 'none');
                        } else {
                            element.css('display', prevDisplay);
                        }
                    }
                }
            }
        };
    }]);
}(angular.module('app')));
