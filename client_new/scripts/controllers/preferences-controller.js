(function (app) {
    'use strict';

    app.controller('preferencesCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$filter', '$location', '$window', function (userSvc, loggerSvc, $rootScope, $scope, $filter, $location, $window) {

        activate();

        function activate() {
            userSvc.getPreferences(function (data) {
                $scope.mv = {language: data.defaultLanguage};
            }, function () {
                loggerSvc.logError($filter('translate')('PREFERENCES_FETCH_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
            });
        }

        $scope.updatePreferences = function () {
            $scope.$watch('$scope.form.$valid', function() {
                $scope.saving = true;
                userSvc.updatePreferences($scope.mv, function () {
                    $scope.saving = false;
                    $rootScope.$broadcast('ChangeLanguage', $scope.mv.language);
                    
                    //var dRoot = $window.document.getElementById('prefWndw');
                    //$scope.slctdPrflItm = 5;
                    //$scope.slctdPrflItm = $index;
                    //$(dRoot).attr('ngInclude', '')
                    
                    //$location.path('/preferences-success');
                }), function() {
                    loggerSvc.logError($filter('translate')('PREFERENCES_SAVE_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                    $scope.saving = false;
                }
                
            })
        };
            
            
            
            
            /*
            if ($scope.form.$valid) {
                            $scope.saving = true;
                            userSvc.updatePreferences($scope.mv, function () {
                                $scope.saving = false;
                                $rootScope.$broadcast('ChangeLanguage', $scope.mv.language);
                                $location.path('/preferences-success');
                            }), function () {
                                loggerSvc.logError($filter('translate')('PREFERENCES_SAVE_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                                $scope.saving = false;
                            }
                            //}//)
                         } else {
                             setFormDirty();
                         }*/
            
        //};

        function setFormDirty() {
            $scope.form.language.$dirty = true;
        }
    }]);
}(angular.module('app')));
