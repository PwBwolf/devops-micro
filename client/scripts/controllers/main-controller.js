(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'browserSvc', 'loggerSvc', 'webStorage', '$rootScope', '$scope', '$translate', '$location', '$route', '$window', '$filter', '$modal', '$routeParams', function (_, appSvc, userSvc, browserSvc, loggerSvc, webStorage, $rootScope, $scope, $translate, $location, $route, $window, $filter, $modal, $routeParams) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;
        $scope.session = {};
        $scope.app = {eventData: {en: 'Welcome to YipTV', es: 'Bienvenido a YipTV'}};

        activate();

        function activate() {
            getAppConfig();
            loadLanguage();
            configSeo();
        }

        $rootScope.$on('ChangeLanguage', function (event, language) {
            changeLanguage(language);
        });

        function changeLanguage(language) {
            $translate.use(language);
            webStorage.local.add('language', language);
            $rootScope.language = language;
            $rootScope.$broadcast('LanguageChanged', language);
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
            changeLanguage(language);
        }

        $scope.$on('$routeChangeSuccess', function () {
            if ($routeParams.lang) {
                changeLanguage($routeParams.lang);
            }
        });

        $scope.goToWordPressUrl = function (url) {
            $window.open($scope.appConfig.wordPressUrl + $filter('translate')(url), '_blank');
        };

        $scope.changeLanguage = function () {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage === 'en' ? 'es' : 'en';
            changeLanguage(newLanguage);
            if (userSvc.isSignedIn($scope.user)) {
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
                            return $filter('translate')('MAIN_LANGUAGE_CHANGE_SAVE_CHECK') + ' ' + getLanguageName(newLanguage) + '?';
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
                        var mv = {language: newLanguage};
                        userSvc.updatePreferences(mv, function () {
                            loggerSvc.logSuccess($filter('translate')('MAIN_LANGUAGE_CHANGE_SAVE_SUCCESS'));
                        }, function () {
                            loggerSvc.logError($filter('translate')('MAIN_LANGUAGE_CHANGE_SAVE_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                        });
                    });
            }
        };

        function getLanguageName(language) {
            if (language === 'en') {
                return 'English';
            } else {
                return 'Español';
            }
        }

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
            $scope.session.signOut = true;
            $location.path('/').search('');
        }
    }]);
}(angular.module('app')));
