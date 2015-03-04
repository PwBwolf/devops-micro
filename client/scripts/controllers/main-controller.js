(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'browserSvc', 'loggerSvc', 'webStorage', '$rootScope', '$scope', '$translate', '$location', '$window', '$filter', '$modal', function (_, appSvc, userSvc, browserSvc, loggerSvc, webStorage, $rootScope, $scope, $translate, $location, $window, $filter, $modal) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;

        var aioWindow,
            aioWindowTimeout;

        activate();

        function activate() {
            getAppConfig();
            loadLanguage();
            configSeo();
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
            }).error(function () {
                loggerSvc.logError($filter('translate')('MAIN_ERROR_APP_CONFIG'));
            });
        }

        function configSeo() {
            $scope.currentRoute = $location.path();
        }

        function loadLanguage() {
            var userLang = browserSvc.getUserLanguage();
            var language = $location.search().lang || webStorage.local.get('language') || userLang.split('-')[0] || 'en';
            $translate.use(language);
            webStorage.local.add('language', language);
            $scope.language = language;
        }

        $scope.changeLanguage = function () {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage === 'en' ? 'es' : 'en';
            $translate.use(newLanguage);
            webStorage.local.add('language', newLanguage);
            $scope.language = newLanguage;
            $rootScope.$broadcast('LanguageChanged');
        };

        $scope.openAio = function () {
            if ($scope.user.status === 'canceled') {
                $location.path('/reactivate-subscription');
            } else if ($scope.user.status === 'trial-ended') {
                $location.path('upgrade-subscription');
            } else {
                if(aioWindowTimeout) {
                    clearTimeout(aioWindowTimeout);
                    aioWindowTimeout = undefined;
                }
                var browser = browserSvc.getBrowserName();
                if (aioWindow && !aioWindow.closed) {
                    aioWindow.focus();
                    if (browser === 'firefox' || browser === 'ie' || browser === 'unknown') {
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
                                    return $filter('translate')('MAIN_VIDEO_PORTAL_ALREADY_OPEN');
                                },
                                showOkButton: function () {
                                    return true;
                                },
                                showYesButton: function () {
                                    return false;
                                },
                                showNoButton: function () {
                                    return false;
                                }
                            }
                        });
                    }
                } else {
                    aioWindow = $window.open('', '_blank');
                    userSvc.getAioToken(function (response) {
                        aioWindow.location.href = $scope.appConfig.aioPortalUrl + '/app/login.php?username=' + response.username + '&sso_token=' + response.sso_token;
                        if (response.isGuest) {
                            aioWindowTimeout = $window.setTimeout(function () {
                                if (aioWindow && !aioWindow.closed) {
                                    aioWindow.close();
                                    aioWindow = undefined;
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
                                                return $filter('translate')('MAIN_FREE_PREVIEW_ENDED');
                                            },
                                            showOkButton: function () {
                                                return true;
                                            },
                                            showYesButton: function () {
                                                return false;
                                            },
                                            showNoButton: function () {
                                                return false;
                                            }
                                        }
                                    });
                                }
                            }, $scope.appConfig.freePreviewTime ? $scope.appConfig.freePreviewTime : 120000);
                        }
                    }, function () {
                        loggerSvc.logError($filter('translate')('MAIN_ERROR_AIO_SSO'));
                        aioWindow.location.href = $scope.appConfig.url + 'error';
                    });
                }
            }
        };

        $scope.signOut = function () {
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
                        return $filter('translate')('MAIN_SIGN_OUT_CONFIRMATION');
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
                    userSvc.signOut(function () {
                        afterSignOut();
                    }, function () {
                        afterSignOut();
                    });
                });
        };

        function afterSignOut() {
            if (aioWindow && !aioWindow.closed) {
                aioWindow.close();
            }
            $location.path('/');

        }

        $window.onunload = function () {
            if (aioWindow && !aioWindow.closed) {
                aioWindow.close();
            }
        };
    }]);
}(angular.module('app')));
