(function (app) {
    'use strict';

    app.controller('signUpSuccessCtrl', ['$sce', '$scope', 'userSvc', 'webStorage', function ($sce, $scope, userSvc, webStorage) {
        var username = webStorage.session.get('signUpUsername');
        var merchant = webStorage.session.get('signUpMerchant');
        webStorage.session.remove('signUpMerchant');
        webStorage.session.remove('signUpUsername');
        if (username && merchant === 'cj') {
            var containerTagId = 13401;
            var cid = 1536367;
            var amount = 14.99;
            var type = 384431;
            var currency = 'USD';
            userSvc.getCustomerNumberAndType(
                username,
                function (oid) {
                    console.log(oid);
                    console.log(oid.split('_').length);
                    console.log(oid.split('_')[3]);
                    if (oid && oid.split('_').length === 4 && oid.split('_')[3] === '0') {

                        $scope.merchantTracker = $sce.trustAsResourceUrl('https://www.emjcd.com/tags/c?containerTagId=' + containerTagId + '&AMOUNT=' + amount + '&CID=' + cid + '&OID=' + oid + '&TYPE=' + type + '&CURRENCY=' + currency);
                    } else {
                        $scope.merchantTracker = '';
                    }
                },
                function () {
                    $scope.merchantTracker = $sce.trustAsResourceUrl('');
                });
        } else {
            $scope.merchantTracker = $sce.trustAsResourceUrl('');
        }
    }]);
}(angular.module('app')));
