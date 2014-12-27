(function (app) {
    'use strict';

    app.controller('changeCreditCardCtrl', ['$scope', function ($scope) {

        $scope.changeCreditCard = function () {
            if($scope.form.$valid) {

            }
            else {
                setFormDirty();
            }
        }

        function setFormDirty() {
            $scope.form.cardNumber.$dirty = true;
            $scope.form.cvv.$dirty = true;
            $scope.form.expiryDate.$dirty = true;
            $scope.form.zipCode.$dirty = true;
        }
    }]);
}(angular.module('app')));
