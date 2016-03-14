(function(){
    'use strict'

    angular
        .module('app')
        .controller('filterPanelSlideCtrl', filterPanelSlideCtrl);

    filterPanelSlideCtrl.$inject = ['$scope']

    function filterPanelSlideCtrl ($scope) {
        activate();

        function activate() {
            $scope.checked = false; // This will be binded using the ps-open attribute

            $scope.toggle = function(){
                $scope.checked = !$scope.checked;
                if($scope.checked) {
                    $scope.$emit('ToggleChannelFilterEvent');
                }
            }
        }

    }
})()
