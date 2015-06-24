(function (app) {
    'use strict';

    app.controller('signInCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$modal', function (userSvc, loggerSvc, $rootScope, $scope, $location, $filter, $modal) {

        activate();

        function activate() {
            var email = $location.search().email;
            if (email) {
                $scope.mv = {email: email};
            }
        }

        $scope.signIn = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        if ($rootScope.redirectTo) {
                            $location.path($rootScope.redirectTo);
                            $rootScope.redirectTo = undefined;
                        } else {
                            $location.path('/user-home');
                            if ($scope.user.status === 'canceled') {
                                $modal.open({
                                    templateUrl: 'modalWindow',
                                    controller: 'modalCtrl',
                                    size: 'sm',
                                    backdrop: 'static',
                                    resolve: {
                                        title: function () {
                                            return $scope.appConfig.appName;
                                        },
                                        body: function () {
                                            return $filter('translate')('SIGN_IN_CANCELED_SUBSCRIPTION_MESSAGE');
                                        },
                                        showOkButton: function () {
                                            return false;
                                        },
                                        showYesButton: function () {
                                            return true;
                                        },
                                        showNoButton: function () {
                                            return true;
                                        }
                                    }
                                }).result.then(function () {
                                        $location.path('/reactivate-subscription');
                                    });
                            } else if ($scope.user.status === 'trial-ended') {
                                $modal.open({
                                    templateUrl: 'modalWindow',
                                    controller: 'modalCtrl',
                                    size: 'sm',
                                    backdrop: 'static',
                                    resolve: {
                                        title: function () {
                                            return $scope.appConfig.appName;
                                        },
                                        body: function () {
                                            return $filter('translate')('SIGN_IN_TRIAL_ENDED_MESSAGE');
                                        },
                                        showOkButton: function () {
                                            return false;
                                        },
                                        showYesButton: function () {
                                            return true;
                                        },
                                        showNoButton: function () {
                                            return true;
                                        }
                                    }
                                }).result.then(function () {
                                        $location.path('/upgrade-subscription');
                                    });
                            } else if ($scope.user.status === 'comp-ended') {
                                $modal.open({
                                    templateUrl: 'modalWindow',
                                    controller: 'modalCtrl',
                                    size: 'sm',
                                    backdrop: 'static',
                                    resolve: {
                                        title: function () {
                                            return $scope.appConfig.appName;
                                        },
                                        body: function () {
                                            return $filter('translate')('SIGN_IN_COMP_ENDED_MESSAGE');
                                        },
                                        showOkButton: function () {
                                            return false;
                                        },
                                        showYesButton: function () {
                                            return true;
                                        },
                                        showNoButton: function () {
                                            return true;
                                        }
                                    }
                                }).result.then(function () {
                                        $location.path('/upgrade-subscription');
                                    });
                            } else if ($scope.user.paymentPending) {
                                $modal.open({
                                    templateUrl: 'modalWindow',
                                    controller: 'modalCtrl',
                                    size: 'sm',
                                    backdrop: 'static',
                                    resolve: {
                                        title: function () {
                                            return $scope.appConfig.appName;
                                        },
                                        body: function () {
                                            return $filter('translate')('SIGN_IN_PAYMENT_PENDING_MESSAGE');
                                        },
                                        showOkButton: function () {
                                            return false;
                                        },
                                        showYesButton: function () {
                                            return true;
                                        },
                                        showNoButton: function () {
                                            return true;
                                        }
                                    }
                                }).result.then(function () {
                                        $location.path('/change-credit-card');
                                    });
                            }
                        }
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UnverifiedAccount') {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED_NOT_VERIFIED'));
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED'));
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
            $scope.form.password.$dirty = true;
        }
    }]);
}(angular.module('app')));
