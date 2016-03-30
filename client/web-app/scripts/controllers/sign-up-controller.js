(function (app) {
    'use strict';

    app.controller('signUpCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$routeParams', 'webStorage', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter, $routeParams, webStorage) {

        $scope.mv = {disclaimer: true, emailSmsSubscription: true};
        if($routeParams.merchant) {
            var merchants = ['truconn', 'cj', 'ubs', 'perkspot'];
            $scope.logo  = {truconn: true, cj: false, ubs: false, perkspot: false};
            if(merchants.indexOf($routeParams.merchant.toLowerCase()) > -1) {
                $scope.mv.merchant = $routeParams.merchant.toLowerCase();
            } else {
                $location.path('/not-found');
            }
        }
        $scope.formSubmit = false;
        $scope.mobileNumberStatus = 'NOT_CHECKED';

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('SIGN_UP_STATE_LOAD_ERROR'));
            });
        }

        $scope.signUp = function () {
            if ($scope.mobileNumberStatus === 'NOT_CHECKED') {
                $scope.checkIfMobileNumber();
            }
            if ($scope.form.$valid && (!$scope.isUsPhoneNumber() || $scope.mobileNumberStatus === 'MOBILE')) {
                $scope.mv.type = 'paid';
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {
                    defaultLanguage: $scope.language || 'en',
                    emailSmsSubscription: $scope.mv.emailSmsSubscription
                };
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function (data) {
                        $rootScope.referredBy = undefined;
                        $scope.saving = false;
                        webStorage.session.add('signUpUsername', $scope.mv.email);
                        webStorage.session.add('signUpMerchant', $scope.mv.merchant);
                        if (data === 'registered') {
                            $location.path('/sign-up-verification/' + $scope.mv.email + '/sign-up-success');
                        } else {
                            $location.path('/sign-up-success-login');
                        }
                    },
                    function (error) {
                        webStorage.session.add('signUpUsername', $scope.mv.email);
                        webStorage.session.add('signUpMerchant', $scope.mv.merchant);
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_USER_EXISTS'));
                        } else if (error === 'PaymentFailed') {
                            $location.path('/sign-up-verification/' + $scope.mv.email + '/sign-up-success-payment-failure');
                        } else if (error === 'PaymentFailedActive') {
                            $location.path('/sign-up-success-payment-failure-login');
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    }
                );
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.firstName.$touched = true;
            $scope.form.lastName.$touched = true;
            $scope.form.email.$touched = true;
            $scope.form.password.$touched = true;
            $scope.form.cardName.$touched = true;
            $scope.form.cardNumber.$touched = true;
            $scope.form.address.$touched = true;
            $scope.form.city.$touched = true;
            $scope.form.state.$touched = true;
            $scope.form.cvv.$touched = true;
            $scope.form.expiryDate.$touched = true;
            $scope.form.zipCode.$touched = true;
            $scope.form.disclaimer.$dirty = true;
            $scope.formSubmit = true;
        }

        function setMobileNumberStatus(status) {
            if ($scope.mobileNumberStatus !== 'NOT_CHECKED') {
                $scope.mobileNumberStatus = status;
            }
        }

        $scope.checkIfMobileNumber = function () {
            if ($scope.form.email.$valid && $scope.isUsPhoneNumber()) {
                $scope.mobileNumberStatus = 'CHECKING';
                appSvc.verifyMobileNumber($scope.mv.email, function (result) {
                    if (result) {
                        setMobileNumberStatus('MOBILE');
                    } else {
                        setMobileNumberStatus('NOT_MOBILE');
                    }
                }, function () {
                    setMobileNumberStatus('NOT_MOBILE');
                });
            }
        };

        $scope.resetMobileNumberStatus = function () {
            $scope.mobileNumberStatus = 'NOT_CHECKED';
        };

        $scope.isUsPhoneNumber = function () {
            var phoneRegex = /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
            return phoneRegex.test($scope.mv.email);
        }

    }]);
}(angular.module('app')));
