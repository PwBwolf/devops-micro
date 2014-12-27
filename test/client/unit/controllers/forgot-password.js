'use strict';

describe('Controller: forgotPasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService;

    beforeEach(module(function($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'FORGOT_PASSWORD_ERROR':
                    return 'Error sending reset password link';
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

    function mockForgotPasswordForm () {
        scope.form = {
            $valid: false,
            email: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {
            email: 'varunv@yiptv.com'
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        controller('forgotPasswordCtrl', {
            $scope: scope,
            userSvc: userSvc,
            loggerSvc: loggerSvc
        });
    }));

    it('should set the form dirty on submit if the form is not valid', function () {
        mockForgotPasswordForm();
        scope.forgotPassword();
        expect(scope.form.email.$dirty).toBe(true);
    });

    it('should redirect to success page on forgot password success', function () {
        mockForgotPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        scope.forgotPassword();
        httpBackend.when('POST', '/api/forgot-password').respond(200, '');
        httpBackend.flush();
        expect(location.path()).toBe('/forgot-password-success');
        expect(scope.saving).toBe(false);
    });

    it('should redirect to success page on user not found error', function () {
        mockForgotPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        scope.forgotPassword();
        httpBackend.when('POST', '/api/forgot-password').respond(404, 'UserNotFound');
        httpBackend.flush();
        expect(location.path()).toBe('/forgot-password-success');
        expect(scope.saving).toBe(false);
    });

    it('should log appropriate error message on internal server error', function () {
        mockForgotPasswordForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        scope.forgotPassword();
        httpBackend.when('POST', '/api/forgot-password').respond(500, 'internalServerError');
        httpBackend.flush();
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error sending reset password link');
        expect(scope.saving).toBe(false);
    });

});