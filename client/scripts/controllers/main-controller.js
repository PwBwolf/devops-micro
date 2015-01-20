(function (app) {
    'use strict';

    app.controller('modalCtrl', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'tokenSvc', 'loggerSvc', 'webStorage', '$rootScope', '$scope', '$translate', '$location', '$route', '$window', '$filter', '$modal', function (_, appSvc, userSvc, tokenSvc, loggerSvc, webStorage, $rootScope, $scope, $translate, $location, $route, $window, $filter, $modal) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;
        var aio;

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
            var userLang = $window.navigator.language || $window.navigator.userLanguage;
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
            console.dir(aio);
            if(aio && !aio.closed) {
                aio.focus();
            } else {
                aio = $window.open('', '_blank');
                userSvc.getAioToken(function (response) {
                    aio.location.href = $scope.appConfig.aioUrl + '/app/login.php?username=' + response.username + '&sso_token=' + response.sso_token;
                    if (response.username.toLowerCase() === 'guest') {
                        $window.setTimeout(function () {
                            if (aio && !aio.closed) {
                                aio.close();
                                aio = undefined;
                                $rootScope.modal = {};
                                $rootScope.modal.title = $scope.appConfig.appName;
                                $rootScope.modal.body = $filter('translate')('MAIN_FREE_PREVIEW_ENDED');
                                $modal.open({
                                    templateUrl: 'modalWindow',
                                    controller: 'modalCtrl',
                                    size: 'sm'
                                });
                            }
                        }, $scope.appConfig.freePreviewTime ? $scope.appConfig.freePreviewTime : 120000);
                    }
                }, function () {
                    loggerSvc.logError($filter('translate')('MAIN_ERROR_AIO_SSO'));
                    aio.location.href = $scope.appConfig.url + 'error';
                });
            }
        };

        $window.onunload = function() {
            if (aio && !aio.closed) {
                aio.close();
            }
        };
    }]);
}(angular.module('app')));
