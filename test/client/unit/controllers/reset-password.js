'use strict';

describe('Controller: resetPasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService,
        userService,
        locationMock;

    beforeEach(module(function ($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'RESET_PASSWORD_USER_ERROR':
                    return 'Unable to change your password. Please contact customer support at';
                    break;
                default:
                    return '';
            }
        }

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translate(text);
            };
        });

        locationMock = jasmine.createSpyObj('$location', ['path', 'search']);
        locationMock.location = "";
        locationMock.params  = {};

        locationMock.path.and.callFake(function (path) {
            if (path !== undefined) {
                this.location = path;
            }
            return this.location;
        });

        locationMock.search.and.callFake(function () {
            return this.params;
        });

        $provide.value('translate', mockTranslateFilter);
        $provide.value('$location', locationMock);
    }));

    function mockResetPasswordForm() {
        scope.form = {
            $valid: false,
            newPassword: {
                $dirty: false
            },
            confirmPassword: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {};
        scope.mv.newPassword = 'Password123!';
        scope.mv.confirmPassword = 'Password123!';
    }

    function initController() {
        controller('resetPasswordCtrl', {
            $scope: scope,
            userSvc: userService,
            loggerSvc: loggerService
        });
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        userService = userSvc;
        scope.appConfig = {
            "appName" : "YipTV",
            "customerCareNumber" : "800-123-1111"
        };
    }));

    describe('checkResetCode', function () {
        it('should set the code error flag to false and show reset password page if code is valid', function () {
            locationMock.params.code = 12345;
            initController();
            httpBackend.expect('GET', '/api/check-reset-code?code='+12345).respond(200);
            httpBackend.flush();
            expect(scope.codeError).toBe(false);
            expect(scope.showPage).toBe(true);
        });

        it('should set the code error flag to true and show page if user does not exist', function () {
            locationMock.params.code = 12345;
            initController();
            httpBackend.expect('GET', '/api/check-reset-code?code='+12345).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(scope.codeError).toBe(true);
            expect(scope.showPage).toBe(true);
        });

        it('should show appropriate error message and show page on internal server error', function () {
            locationMock.params.code = 12345;
            initController();
            httpBackend.expect('GET', '/api/check-reset-code?code='+12345).respond(500);
            httpBackend.flush();
            expect(scope.userError).toBe(true);
            expect(scope.showPage).toBe(true);
        });
    });

    describe('resetPassword', function () {

        beforeEach(function () {
            locationMock.params.code = 12345;
            initController();
            httpBackend.expect('GET', '/api/check-reset-code?code='+12345).respond(200);
            httpBackend.flush();
        });

        it('should set the form dirty on submit if the form is not valid', function () {
            mockResetPasswordForm();
            mockModelView();
            scope.resetPassword();
            expect(scope.form.newPassword.$dirty).toBe(true);
            expect(scope.form.confirmPassword.$dirty).toBe(true);
        });

        it('should redirect to reset password success page on reset password success', function () {
            mockResetPasswordForm();
            mockModelView();
            scope.form.$valid = true;
            scope.resetPassword();
            expect(scope.saving).toBe(true);
            httpBackend.expect('POST', '/api/reset-password').respond(200);
            httpBackend.flush();
            expect(location.path()).toBe('/reset-password-success');
            expect(scope.saving).toBe(false);
        });

        it('should log appropriate error message on error(user not found)', function () {
            mockResetPasswordForm();
            mockModelView();
            scope.form.$valid = true;
            spyOn(loggerService, 'logError');
            scope.resetPassword();
            expect(scope.saving).toBe(true);
            httpBackend.expect('POST', '/api/reset-password').respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(loggerService.logError).toHaveBeenCalledWith('Unable to change your password. Please contact customer support at 800-123-1111');
            expect(scope.saving).toBe(false);
        });

        it('should log appropriate error message on error(internal server error)', function () {
            mockResetPasswordForm();
            mockModelView();
            scope.form.$valid = true;
            spyOn(loggerService, 'logError');
            scope.resetPassword();
            expect(scope.saving).toBe(true);
            httpBackend.expect('POST', '/api/reset-password').respond(500);
            httpBackend.flush();
            expect(loggerService.logError).toHaveBeenCalledWith('Unable to change your password. Please contact customer support at 800-123-1111');
            expect(scope.saving).toBe(false);
        });
    });

});