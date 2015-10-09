(function (app) {
    'use strict';

    app.controller('channelFilterCtrl', ['_', '$scope', '$rootScope', '$modalInstance', 'mediaSvc', function (_, $scope, $rootScope, $modalInstance, mediaSvc) {

        $scope.filteredChannels = $rootScope.channels;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];

        $scope.close = function () {
            $modalInstance.dismiss('close');
        };


    }]);
}(angular.module('app')));
