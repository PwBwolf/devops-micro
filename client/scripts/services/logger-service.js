(function (app) {
    'use strict';

    app.factory('loggerSvc', ['$log', 'toastr', function ($log, toastr) {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-full-width';
        toastr.options.closeButton = true;

        var service = {
            logInfo: function (message) {
                logIt(message, 'info');
            },

            logError: function (message) {
                logIt(message, 'error');
            },

            logSuccess: function (message) {
                logIt(message, 'success');
            },

            logWarning: function (message) {
                logIt(message, 'warning');
            }
        };
        return service;

        function logIt(message, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            write(message);
            if (toastType === 'error') {
                toastr.error(message);
            } else if (toastType === 'warning') {
                toastr.warning(message);
            } else if (toastType === 'success') {
                toastr.success(message);
            } else {
                toastr.info(message);
            }
        }
    }]);
})(angular.module('app'));
