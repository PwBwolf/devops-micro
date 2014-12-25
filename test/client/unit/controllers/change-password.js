'use strict';

describe('Controller: changePasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var scope,
        controller,
        httpBackend,
        location,
        loggerService;

    function initForm() {
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

    function initModelView() {
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
        initForm();
        scope.changePassword();
        expect(scope.form.currentPassword.$dirty).toBe(true);
        expect(scope.form.newPassword.$dirty).toBe(true);
        expect(scope.form.confirmPassword.$dirty).toBe(true);
    });

    it('should redirect to success page on password change success', function () {
        initForm();
        initModelView();
        scope.form.$valid = true;
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(200, []);
        httpBackend.flush();
        expect(location.path()).toBe('/change-password-success');
    });

    it('should display wrong password message if the password entered is wrong', function () {
        initForm();
        initModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(401, 'Unauthorized');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Current Password entered is incorrect');
    });

    it('should display error message if the user not found', function () {
        initForm();
        initModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(404, 'UserNotFound');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error occurred while changing the password');
    });

    it('should display error message on internal server error', function () {
        initForm();
        initModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.changePassword();
        httpBackend.when("POST", "/api/change-password").respond(500, 'InternalServerError');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error occurred while changing the password');
    });


});