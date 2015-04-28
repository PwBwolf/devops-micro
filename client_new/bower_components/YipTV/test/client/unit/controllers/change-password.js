'use strict';

describe('Controller: changePasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var scope,
        controller,
        httpBackend,
        location,
        loggerService;

    beforeEach(module(function($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'CHANGE_PASSWORD_INCORRECT_PASSWORD':
                    return 'Current Password entered is incorrect';
                    break;
                case 'CHANGE_PASSWORD_ERROR':
                    return 'Error occurred while changing the password';
                    break;
                default:
                    return '';
            }
        }

        $provide.value('translate', mockTranslateFilter);

        $filterProvider.register('translate', function(translate){
            return function(text) {
                return translate(text);
            };
        });

    }));

    function mockChangePasswordForm() {
        scope.form = {
            $valid: false,
            currentPassword: {
                $dirty: false
            },
            newPassword: {
                $dirty: false
            },
            confirmPassword: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {
            currentPassword: 'Password@123',
            newPassword: 'Password123!',
            confirmPassword: 'Password123!'
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        location = $location;
        loggerService = loggerSvc;
        controller('changePasswordCtrl', {
            $scope: scope,
            appSvc: userSvc,
            loggerSvc: loggerSvc
        });
    }));

    it('should set the form dirty', function () {
        mockChangePasswordForm();
        scope.changePassword();
        expect(scope.form.currentPassword.$dirty).toBe(true);
        expect(scope.form.newPassword.$dirty).toBe(true);
        expect(scope.form.confirmPassword.$dirty).toBe(true);
    });

    it('should redirect to success page on password change success', function () {
        mockChangePasswordForm();
        mockModelView();
        scope.form.$valid = true;
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(200, []);
        httpBackend.flush();
        expect(location.path()).toBe('/change-password-success');
    });

    it('should log appropriate error message if the password entered is wrong', function () {
        mockChangePasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(401, 'Unauthorized');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Current Password entered is incorrect');
    });

    it('should log appropriate error message on user not found', function () {
        mockChangePasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(404, 'UserNotFound');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error occurred while changing the password');
    });

    it('should log appropriate error message on internal server error', function () {
        mockChangePasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(500, 'InternalServerError');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error occurred while changing the password');
    });


});