'use strict';

describe('Service: appSvc', function () {

    beforeEach(module('app'));

    var appService,
        httpBackend,
        success, error;

    var mockCallBacks = {
        success: function (data) {
            if (data === undefined) {
                success = true;
            }
            else {
                success = data;
            }

        },
        error: function (err) {
            if (err === undefined) {
                error = true;
            }
            else {
                error = err;
            }
        }
    };

    beforeEach(inject(function (appSvc, $httpBackend) {
        appService = appSvc;
        httpBackend = $httpBackend;
        success = null;
        error = null;
    }));

    describe('getAppConfig', function () {
        var appConfig = 'appConfig';

        it('should call success callback on success', function () {
            var response = appService.getAppConfig();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-app-config').respond(200, appConfig);
            httpBackend.flush();
            expect(error).toBe(null);
            expect(success).toEqual(appConfig);
        });

        it('should call error callback on error', function () {
            var response = appService.getAppConfig();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-app-config').respond(500);
            httpBackend.flush();
            expect(error).toBe(true);
            expect(success).toBe(null);
        });
    });

    describe('getCountries', function () {
        var countries = ['USA', 'Mexico', 'Spain'];

        it('should return a list of countries on success', function () {
            var response = appService.getCountries();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-countries').respond(200, countries);
            httpBackend.flush();
            expect(success).toEqual(countries);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            var response = appService.getCountries();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-countries').respond(500);
            httpBackend.flush();
            expect(success).toEqual(null);
            expect(error).toBe(true);
        });

    });

    describe('saveContactUs', function () {
        var data = {
            details: 'hello \n I  am varun '
        };

        it('should remove the new line character and extra spaces from user details', function () {
            appService.saveContactUs(data, mockCallBacks.success, mockCallBacks.error);
            data.details = 'hello I am varun';
            httpBackend.expect('POST', '/api/save-contact-us', data).respond(200);
            httpBackend.flush();
        });

        it('should call success callback on success', function () {
            appService.saveContactUs(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/save-contact-us').respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            appService.saveContactUs(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/save-contact-us').respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });
    });

    describe('saveVisitor', function () {
        var visitor = {
            name: 'varun',
            email: 'varun@yiptv.com'
        };

        it('should call success callback on success', function () {
            appService.saveVisitor(visitor, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/save-visitor', visitor).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call success callback on success', function () {
            appService.saveVisitor(visitor, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/save-visitor', visitor).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });
    });

    describe('sendRafEmails', function () {
        var data = {
            email: 'varun@yiptv.com'
        };

        it('should call success callback on success', function () {
            appService.sendRafEmails(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/send-raf-emails', data).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            appService.sendRafEmails(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/send-raf-emails', data).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });
    });

});