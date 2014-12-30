'use strict';

describe('Controller: signInCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService,
        rootScope,
        response = {};

    var mockResponse = function (status, message) {
        response.status = status;
        response.message = message;
    };

    var mockUserService = {
        signIn : function (user, success, error) {
            if(response.statusCode === 200) {
                success(response.message);
            }
            else {
                error(response.message);
            }
        }
    };

    beforeEach(module(function ($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'SIGN_IN_FAILED_NOT_VERIFIED':
                    return 'Sign In failed as your account has not been verified yet';
                case 'SIGN_IN_FAILED':
                    return 'Sign In failed';
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

        $provide.value('userSvc', mockUserService);

    }));

    function mockSignInForm() {
        scope.form = {
            $valid: false,
            email: {
                $dirty: false
            },
            password: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {
            email: 'varunv@yiptv.com',
            password: 'Password123!'
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;

        scope.appConfig =
        {
            "appName" : "YipTV",
            "customerCareNumber" : "800-123-1111"
        };

        controller('signInCtrl', {
            $scope: scope,
            $rootScope: rootScope,
            userSvc: userSvc,
            loggerSvc: loggerSvc
        });
    }));

    it('should set the form dirty on submit if the form is not valid', function () {
        mockSignInForm();
        scope.signIn();
        expect(scope.form.email.$dirty).toBe(true);
        expect(scope.form.password.$dirty).toBe(true);
    });

    it('should redirect to user home on sign in success if $rootScope.redirectTo is undefined', function () {
        mockSignInForm();
        mockModelView();
        scope.form.$valid = true;
        mockResponse(200);
        scope.signIn();
        setTimeout(function() {
            expect(location.path()).toBe('/user-home');
        }, 100);
        expect(scope.saving).toBe(false);
    });

    it('should redirect to the location in $rootScope.redirectTo on sign in success if $rootScope.redirectTo is set', function () {
        mockSignInForm();
        mockModelView();
        scope.form.$valid = true;
        rootScope.reditectTo = '/refer-a-friend';
        mockResponse(200);
        scope.signIn();
        setTimeout(function() {
            expect(location.path()).toBe('/refer-a-friend');
        }, 100);
        expect(rootScope.redirectTo).toBe(undefined);
        expect(scope.saving).toBe(false);
    });

    it('should log appropriate error message on unverified account', function () {
        mockSignInForm();
        mockModelView();
        spyOn(loggerService, 'logError');
        scope.form.$valid = true;
        mockResponse(401, 'UnverifiedAccount');
        scope.signIn();
        expect(scope.saving).toBe(false);
        expect(loggerService.logError).toHaveBeenCalledWith('Sign In failed as your account has not been verified yet');
    });

    it('should log appropriate error message on unauthorized access', function () {
        mockSignInForm();
        mockModelView();
        spyOn(loggerService, 'logError');
        scope.form.$valid = true;
        rootScope.reditectTo = '/refer-a-friend';
        mockResponse(401, 'SignInFailed');
        scope.signIn();
        expect(scope.saving).toBe(false);
        expect(loggerService.logError).toHaveBeenCalledWith('Sign In failed');
    });

    it('should log appropriate error message on internal server error', function () {
        mockSignInForm();
        mockModelView();
        spyOn(loggerService, 'logError');
        scope.form.$valid = true;
        rootScope.reditectTo = '/refer-a-friend';
        mockResponse(500);
        scope.signIn();
        expect(scope.saving).toBe(false);
        expect(loggerService.logError).toHaveBeenCalledWith('Sign In failed');
    });

    it('should log appropriate error message on user not found', function () {
        mockSignInForm();
        mockModelView();
        spyOn(loggerService, 'logError');
        scope.form.$valid = true;
        rootScope.reditectTo = '/refer-a-friend';
        mockResponse(404, 'UserNotFound');
        scope.signIn();
        expect(scope.saving).toBe(false);
        expect(loggerService.logError).toHaveBeenCalledWith('Sign In failed');
    });

});