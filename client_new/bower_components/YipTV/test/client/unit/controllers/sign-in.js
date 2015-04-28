'use strict';

describe('Controller: signInCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService,
        rootScope;

    var mockUserService = {
        response: {
            statusCode: null,
            message: null
        },
        signIn : function (user, success, error) {
            if(this.response.statusCode === 200) {
                success(this.response.message);
            }
            else {
                error(this.response.message);
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

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translate(text);
            };
        });

        var locationMock = jasmine.createSpyObj('location', ['path']);
        locationMock.location = "";

        locationMock.path.and.callFake(function (path) {
            if (path !== undefined) {
                locationMock.location = path;
            }
            return locationMock.location;
        });

        $provide.value('translate', mockTranslateFilter);
        $provide.value('userSvc', mockUserService);
        $provide.value('$location', locationMock);

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
        mockUserService.response.statusCode = 200;
        scope.signIn();
        expect(location.path).toHaveBeenCalledWith('/user-home');
        expect(scope.saving).toBe(false);
    });

    it('should redirect to the location in $rootScope.redirectTo on sign in success if $rootScope.redirectTo is set', function () {
        mockSignInForm();
        mockModelView();
        scope.form.$valid = true;
        rootScope.redirectTo = '/refer-a-friend';
        mockUserService.response.statusCode = 200;
        scope.signIn();
        expect(location.path).toHaveBeenCalledWith('/refer-a-friend');
        expect(rootScope.redirectTo).toBe(undefined);
        expect(scope.saving).toBe(false);
    });

    it('should log appropriate error message on unverified account', function () {
        mockSignInForm();
        mockModelView();
        spyOn(loggerService, 'logError');
        scope.form.$valid = true;
        mockUserService.response.statusCode = 401;
        mockUserService.response.message = 'UnverifiedAccount';
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
        mockUserService.response.statusCode = 401;
        mockUserService.response.message = 'SignInFailed';
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
        mockUserService.response.statusCode = 500;
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
        mockUserService.response.statusCode = 404;
        mockUserService.response.message = 'UserNotFound';
        scope.signIn();
        expect(scope.saving).toBe(false);
        expect(loggerService.logError).toHaveBeenCalledWith('Sign In failed');
    });

});