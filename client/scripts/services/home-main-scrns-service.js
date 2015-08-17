(function (app) {
    'use strict';

    app.factory('homeScrnsSvc', [function () {
        var usrMnScrn = {mnView: 'images/friend-banner.jpg', mnChnl: 'images/apple-touch-icon.png'};

        var usrScrnClasses = [
            {className: 'sgstdChnl'},
            {className: 'sgstdChnl_open'},
            {className: 'position-div'},
            {className: 'front'},
            {className: 'back'}
        ];

        var usrScrnFctry = {};
        usrScrnFctry.getUsrData = function () {
            return usrMnScrn;
        };
        usrScrnFctry.getUsrClass = function () {
            return usrScrnClasses;
        };

        usrScrnFctry.sendUsrData = function () {

        };
        return usrScrnFctry;
    }]);
}(angular.module('app')));
