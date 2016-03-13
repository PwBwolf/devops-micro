(function (app) {
    'use strict';

    app.controller('signUpSuccessCtrl', ['$sce', '$scope', 'userSvc', 'webStorage', function ($sce, $scope, userSvc, webStorage) {
        var username = webStorage.session.get('signUpUsername');
        var merchant = webStorage.session.get('signUpMerchant');
        webStorage.session.remove('signUpMerchant');
        webStorage.session.remove('signUpUsername');
        var containerTagId = 13401;
        var cid = 1536367;
        var amount = 14.99;
        var type = 384431;
        var currency = 'USD';
        if (!merchant || merchant === 'cj') {
            if (username) {
                userSvc.getCustomerNumberAndType(
                    username,
                    function (oid) {
                        $scope.cj = $sce.trustAsResourceUrl('https://www.emjcd.com/tags/c?containerTagId=' + containerTagId + '&AMOUNT=' + amount + '&CID=' + cid + '&OID=' + oid + '&TYPE='+ type +'&CURRENCY=' + currency);
                    },
                    function (error) {
                        $scope.cj = $sce.trustAsResourceUrl('https://www.emjcd.com/tags/c?containerTagId=' + containerTagId + '&AMOUNT=' + '0' + '&CID=' + cid + '&OID=' + oid + '&TYPE='+ type +'&CURRENCY=' + currency);
                    });
            } else {
                $scope.cj = $sce.trustAsResourceUrl('');
            }
        } else {
            $scope.cj = $sce.trustAsResourceUrl('');
        }
    }]);
}(angular.module('app')));
