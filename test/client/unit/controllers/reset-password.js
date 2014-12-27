'use strict';

describe('Controller: resetPasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService;

    beforeEach(module(function ($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'RESET_PASSWORD_USER_ERROR':
                    return 'The reset password link has expired and is no longer valid';
                    break;
                case 'RESET_PASSWORD_ERROR':
                    return 'Unable to change your password. Please contact YipTV customer care.';
                    break;
                default:
                    return '';
            }
        }

        $provide.value('translate', mockTranslateFilter);

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translate(text);
            };
        });

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
        scope.mv.code =  'code1234';
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        controller('resetPasswordCtrl', {
            $scope: scope,
            userSvc: userSvc,
            loggerSvc: loggerSvc
        });
    }));

    it('should set the code error flag to false and show reset password page if code is valid', function () {
        httpBackend.when('GET', '/api/check-reset-code').respond(200);
        httpBackend.flush();
        expect(scope.codeError).toBe(false);
        expect(scope.showPage).toBe(true);
    });

    it('should set the code error flag to true and show page if user does not exist', function () {
        httpBackend.when('GET', '/api/check-reset-code').respond(404, 'UserNotFound');
        httpBackend.flush();
        expect(scope.codeError).toBe(true);
        expect(scope.showPage).toBe(true);
    });

    it('should show appropriate error message and show page on internal server error', function () {
        spyOn(loggerService, 'logError');
        httpBackend.when('GET', '/api/check-reset-code').respond(500);
        httpBackend.flush();
        expect(loggerService.logError).toHaveBeenCalledWith('Unable to change your password. Please contact YipTV customer care.');
        expect(scope.showPage).toBe(true);
    });

    it('should show appropriate error message if code is undefined on form submit', function () {
        mockModelView();
        scope.mv.code = undefined;
        spyOn(loggerService, 'logError');
        scope.resetPassword();
        expect(loggerService.logError).toHaveBeenCalledWith('Unable to change your password. Please contact YipTV customer care.');
    });

    it('should set the form dirty on submit if the form is not valid', function () {
        mockResetPasswordForm();
        mockModelView();
        scope.resetPassword();
        expect(scope.form.newPassword.$dirty).toBe(true);
        expect(scope.form.confirmPassword.$dirty).toBe(true);
    });

    it('should redirect to reset password success page on reset password success', function () {
        httpBackend.expect('GET', '/api/check-reset-code').respond(200);
        mockResetPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        httpBackend.when('POST', '/api/reset-password').respond(200);
        scope.resetPassword();
        httpBackend.flush();
        expect(location.path()).toBe('/reset-password-success');
        expect(scope.saving).toBe(false);
    });

    it('should log appropriate error message on user not found', function () {
        httpBackend.expect('GET', '/api/check-reset-code').respond(200);
        mockResetPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        httpBackend.when('POST', '/api/reset-password').respond(404, 'UserNotFound');
        scope.resetPassword();
        httpBackend.flush();
        expect(loggerService.logError).toHaveBeenCalledWith('The reset password link has expired and is no longer valid');
        expect(scope.saving).toBe(false);
    });

    it('should log appropriate error message on internal server error', function () {
        httpBackend.expect('GET', '/api/check-reset-code').respond(200);
        mockResetPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        httpBackend.when('POST', '/api/reset-password').respond(500, '');
        scope.resetPassword();
        httpBackend.flush();
        expect(loggerService.logError).toHaveBeenCalledWith('Unable to change your password. Please contact YipTV customer care.');
        expect(scope.saving).toBe(false);
    });

});