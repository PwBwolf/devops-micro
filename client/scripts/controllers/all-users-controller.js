(function (app) {
    'use strict';

    app.controller('allUsersCtrl', ['adminSvc', 'loggerSvc', 'ngTableParams', '$scope', '$filter', function (adminSvc, loggerSvc, ngTableParams, $scope, $filter) {

        $scope.users = [];
        activate();
        setHeaders();

        $scope.$on('LanguageChanged', setHeaders);

        function setHeaders() {
            $scope.email = $filter('translate')('ALL_USERS_EMAIL');
            $scope.name = $filter('translate')('ALL_USERS_NAME');
            $scope.type = $filter('translate')('ALL_USERS_TYPE');
        }

        $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10
            },
            {
                total: $scope.users.length,
                getData: function ($defer, params) {
                    $defer.resolve($scope.users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                },
                $scope: { $data: {} }
            });

        function activate() {
            adminSvc.getAllUsers().success(function(data) {
                $scope.users = data;
                $scope.tableParams.total(data.length);
                $scope.tableParams.reload();
            }).error(function(){
                loggerSvc.logError($filter('translate')('ALL_USERS_USER_LOAD_ERROR'));
            });
        }
    }]);
}(angular.module('app')));
