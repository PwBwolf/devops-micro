(function (app) {
    'use strict';

    app.controller('complimentarySignUpCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$rootScope', '$scope', '$routeParams', '$location', '$filter', function (appSvc, userSvc, loggerSvc, $rootScope, $scope, $routeParams, $location, $filter) {

        $scope.status = 0; // 0 - checking, 1 - success, 2 - error
        activate();

        function activate() {
            var code = $routeParams.compCode;
            appSvc.checkComplimentaryCode(code).success(function(){
                $scope.status = 1;
            }).error(function(){
                $scope.status = 2;
            });
        }

        $scope.mv = {disclaimer: true};

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.mv.type = 'comp';
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en'};
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function () {
                        $rootScope.referredBy = undefined;
                        $location.path('/comp-sign-up-success');
                        $scope.saving = false;
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('COMP_SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('COMP_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.firstName.$dirty = true;
            $scope.form.lastName.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.telephone.$dirty = true;
            $scope.form.password.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
            $scope.form.disclaimer.$dirty = true;
        }

    }]);
}(angular.module('app')));
