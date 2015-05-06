(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'browserSvc', 'loggerSvc', 'webStorage', '$rootScope', '$scope', '$translate', '$location', '$route', '$window', '$filter', '$modal', function (_, appSvc, userSvc, browserSvc, loggerSvc, webStorage, $rootScope, $scope, $translate, $location, $route, $window, $filter, $modal) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;
        $scope.session = {};

        var aioWindow,
            aioWindowTimeout;

        activate();

        function activate() {
            $scope.webSliders = webStorage.local.get('webSliders') || [];
            $scope.webSliderLoaded = $scope.webSliders && $scope.webSliders.length !== 0;
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
            $scope.language = language;
            $rootScope.$broadcast('LanguageChanged', language);
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
                getWebSliders();
            }).error(function () {
                loggerSvc.logError($filter('translate')('MAIN_ERROR_APP_CONFIG'));
            });
        }

        function getWebSliders() {
            if ($scope.appConfig.webSliderVersion !== webStorage.get('webSliderVersion') || !$scope.webSliders || $scope.webSliders.length === 0) {
                appSvc.getWebSliders().success(function (data) {
                    webStorage.local.add('webSliderVersion', $scope.appConfig.webSliderVersion);
                    webStorage.local.add('webSliders', data);
                    $scope.webSliders = data;
                    $scope.webSliderLoaded = $scope.webSliders && $scope.webSliders.length !== 0;
                    if ($location.path() === '/') {
                        $route.reload();
                    }
                });
            }
        }

        function configSeo() {
            $scope.currentRoute = $location.path();
        }

        function loadLanguage() {
            var userLang = browserSvc.getUserLanguage();
            var language = $location.search().lang || webStorage.local.get('language') || userLang.split('-')[0] || 'en';
            changeLanguage(language);
        }

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

        $scope.openAio = function () {
            if ($scope.user.status === 'canceled') {
                $location.path('/reactivate-subscription');
            } else if ($scope.user.status === 'trial-ended' || $scope.user.status === 'comp-ended') {
                $location.path('/upgrade-subscription');
            } else {
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
                    if (aioWindowTimeout) {
                        clearTimeout(aioWindowTimeout);
                        aioWindowTimeout = undefined;
                    }
                    aioWindow = $window.open('', '_blank');
                    userSvc.getAioToken(function (response) {
                        if (!response.username || !response.sso_token) {
                            if (aioWindow && !aioWindow.closed) {
                                aioWindow.close();
                                aioWindow = undefined;
                            }
                            $location.path('/error');
                        } else {
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
                        }
                    }, function () {
                        loggerSvc.logError($filter('translate')('MAIN_ERROR_AIO_SSO'));
                        if (aioWindow && !aioWindow.closed) {
                            aioWindow.close();
                            aioWindow = undefined;
                        }
                        $location.path('/error');
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
            $rootScope.$broadcast('CloseAioWindow');
            $scope.session.signOut = true;
            $location.path('/');

        }

        $window.onunload = function () {
            $rootScope.$broadcast('CloseAioWindow');
        };

        $rootScope.$on('CloseAioWindow', function () {
            if (aioWindow && !aioWindow.closed) {
                aioWindow.close();
            }
        });
		

		$rootScope.$on("$locationChangeSuccess", function(event, newLoc, oldLoc) {
			var dBtns = [$('#Shws'), $('#Ntwrks'), $('#Abt')];
			var baseLoc = $location.host();
			var fullLoc = 'https://'+baseLoc+'/'+$location.url();
			
			if( newLoc != fullLoc){
				/*
				for(var b = 0; b < dBtns.length; b++){
									dBtns[b].css('display', 'none');
								}*/
				
				console.log('we\'re not home. this is location: '+fullLoc);
			} else {
				/*
				for(var c = 0; c < dBtns.length; c++){
									dBtns[c].css('display', 'inline-block');
								}*/
				console.log('this is home '+fullLoc);
				
			}
			console.log('moving from: '+oldLoc+' -  to '+newLoc);
		});
		/*
		$rootScope.$on("$locationChangeSuccess", function(event, newLoc, oldLoc) {
					console.log('moving to: '+newLoc);
				});*/
		
		
		
    }]);
}(angular.module('app')));
