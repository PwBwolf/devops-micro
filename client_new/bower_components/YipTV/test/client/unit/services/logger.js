'use strict';

describe('Service: loggerSvc', function () {

    beforeEach(module('app'));

    var loggerService,
        toastMock,
        toast, log,
        logMock;

    beforeEach(module(function ($provide) {
        toastMock = jasmine.createSpyObj('toast', ['error', 'warning', 'success', 'info']);
        toastMock.options = {};
        toastMock.success.and.callFake(function (message) {
            return message;
        });
        toastMock.error.and.callFake(function (message) {
            return message;
        });
        toastMock.info.and.callFake(function (message) {
            return message;
        });
        toastMock.warning.and.callFake(function (message) {
            return message;
        });

        logMock = jasmine.createSpyObj('log', ['error', 'log']);
        logMock.error.and.callFake(function (message) {
            return message;
        });
        logMock.log.and.callFake(function (message) {
            return message;
        });

        $provide.value('toastr', toastMock);
        $provide.value('$log', logMock);
    }));

    beforeEach(inject(function (loggerSvc, toastr, $log) {
        loggerService = loggerSvc;
        toast = toastr;
        log = $log;
    }));

    describe('initialization', function () {
        it('should initialize the toast options with appropriate values', function () {
            expect(toastr.options.timeOut).toEqual(5000);
            expect(toastr.options.positionClass).toEqual('toast-bottom-full-width');
            expect(toastr.options.closeButton).toEqual(true);
        });
    });

    describe('logInfo', function () {
        var message = "info";
        it('should call the toastr.info', function () {
            loggerService.logInfo(message);
            expect(log.log).toHaveBeenCalledWith(message);
            expect(toast.info).toHaveBeenCalledWith(message);
        });
    });

    describe('logError', function () {
        var message = "error message";
        it('should call the toastr.error', function () {
            loggerService.logError(message);
            expect(log.error).toHaveBeenCalledWith(message);
            expect(toast.error).toHaveBeenCalledWith(message);
        });
    });

    describe('logSuccess', function () {
        var message = "success message";
        it('should call the toastr.success', function () {
            loggerService.logSuccess(message);
            expect(log.log).toHaveBeenCalledWith(message);
            expect(toast.success).toHaveBeenCalledWith(message);
        });
    });

    describe('logWarning', function () {
        var message = "warning message";
        it('should call the toastr.warning', function () {
            loggerService.logWarning(message);
            expect(log.log).toHaveBeenCalledWith(message);
            expect(toast.warning).toHaveBeenCalledWith(message);
        });
    });
});