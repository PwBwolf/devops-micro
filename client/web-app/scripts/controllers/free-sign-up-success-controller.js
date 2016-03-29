(function (app) {
    'use strict';

    app.controller('freeSignUpSuccessCtrl', ['$sce', '$scope', 'userSvc', 'webStorage', function ($sce, $scope, userSvc, webStorage) {
        var username = webStorage.session.get('signUpUsername');
        var merchant = webStorage.session.get('signUpMerchant');
        webStorage.session.remove('signUpMerchant');
        webStorage.session.remove('signUpUsername');
        if (username && merchant === 'cj') {
            var containerTagId = 12730;
            var cid = 1536367;
            var amount = 0;
            var type = 383212;
            var currency = 'USD';
            userSvc.getCustomerNumberAndType(
                username,
                function (oid) {
                    $scope.merchantTracker = $sce.trustAsResourceUrl('https://www.emjcd.com/tags/c?containerTagId=' + containerTagId + '&AMOUNT=' + amount + '&CID=' + cid + '&OID=' + oid + '&TYPE=' + type + '&CURRENCY=' + currency);
                },
                function () {
                    $scope.merchantTracker = $sce.trustAsResourceUrl('');
                });
        } else {
            $scope.merchantTracker = $sce.trustAsResourceUrl('');
        }
    }]);
}(angular.module('app')));
