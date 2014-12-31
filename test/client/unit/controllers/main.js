'use strict';

describe('Controller: mainCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService,
        window;

    var mockUserService = {
        user : 'varun',
        userRoles : {
            anon: { bitMask: 1, title: 'anon' },
            user: { bitMask: 2, title: 'user' },
            admin: { bitMask: 4, title: 'admin' },
            'super-admin': { bitMask: 8, title: 'super-admin' }
        },
        accessLevels : {
            public: { bitMask: 15 },
            anon: { bitMask: 1 },
            user: { bitMask: 14 },
            admin: { bitMask: 12 },
            'super-admin': { bitMask: 8 }
        }
    };

    beforeEach(module(function($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'MAIN_ERROR_APP_CONFIG':
                    return 'Error fetching application configuration';
                case 'MAIN_ERROR_AIO_SSO':
                    return 'Error opening video portal';
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

        function mockRoute () {

        }

        $provide.value('userSvc', mockUserService);
        $provide.value('$route', mockRoute);

    }));


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, appSvc, $httpBackend, $location, loggerSvc, $window, $translate) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        window = $window;
        controller('mainCtrl', {
            $scope: scope,
            userSvc: userSvc,
            loggerSvc: loggerSvc,
            appSvc : appSvc,
            $translate: $translate
        });
    }));

    it('should fetch the app config on initialization', function () {
        httpBackend.expect('GET', '/api/get-app-config').respond(200, "appConfig");
        httpBackend.flush();
        expect(scope.appConfig).toEqual("appConfig");
        expect(scope.showHeader).toBe(true);
    });

    it('should fetch the app config on initialization', function () {
        httpBackend.expect('GET', '/api/get-app-config').respond(200);
        httpBackend.flush();
        expect(scope.appConfig).toBe(undefined);
        expect(scope.showHeader).toBe(true);
    });

    it('should log appropriate error message on error fetching app config', function () {
        spyOn(loggerService, 'logError');
        httpBackend.expect('GET', '/api/get-app-config').respond(500);
        httpBackend.flush();
        expect(loggerService.logError).toHaveBeenCalledWith('Error fetching application configuration');
        expect(scope.showHeader).toBe(false);
    });

    it('should set the $scope.currentRoute to current location', function () {
        httpBackend.expect('GET', '/api/get-app-config').respond(200);
        httpBackend.flush();
        expect(scope.currentRoute).toEqual(location.path());
    });

    it('should set the $scope.currentRoute to current location', function () {
        httpBackend.expect('GET', '/api/get-app-config').respond(200);
        httpBackend.flush();
    });

});