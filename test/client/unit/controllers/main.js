'use strict';

describe('Controller: mainCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService,
        userService,
        appService,
        translate,
        webstorage,
        window,
        locationMock,
        translateMock,
        userServiceMock,
        windowServiceMock;

    var urlParams = {};

    beforeEach(module(function ($provide, $filterProvider) {

        locationMock = jasmine.createSpyObj('location', ['path', 'search']);
        locationMock.location = "";

        locationMock.path.and.callFake(function (path) {
            if (path !== undefined) {
                this.location = path;
            }
            return this.location;
        });

        locationMock.search.and.callFake(function () {
            this.location = urlParams;
            return this.location;
        });

        translateMock = jasmine.createSpyObj('translate', ['use']);
        translateMock.language = "en";

        translateMock.use.and.callFake(function (language) {
            if (language !== undefined) {
                this.language = language;
            }
            return this.language;
        });

        //translate filter mock
        function translateFilterMock(value) {
            switch (value) {
                case 'MAIN_ERROR_APP_CONFIG':
                    return 'Error fetching application configuration';
                case 'MAIN_ERROR_AIO_SSO':
                    return 'Error opening video portal';
                default:
                    return '';
            }
        }

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translateFilterMock(text);
            };
        });

        userServiceMock = jasmine.createSpyObj('userService', ['getAioToken']);
        userServiceMock.user = 'varun';
        userServiceMock.response = null;
        userServiceMock.setResponse = function (status, body) {
            userServiceMock.response = {
                status: status,
                body: body
            }
        };
        userServiceMock.userRoles = {
            anon: { bitMask: 1, title: 'anon' },
            user: { bitMask: 2, title: 'user' },
            admin: { bitMask: 4, title: 'admin' },
            superAdmin: { bitMask: 8, title: 'superAdmin' }
        };
        userServiceMock.accessLevels = {
            public: { bitMask: 15 },
            anon: { bitMask: 1 },
            user: { bitMask: 14 },
            admin: { bitMask: 12 },
            superAdmin: { bitMask: 8 }
        };
        userServiceMock.getAioToken.and.callFake(function (success, error) {
            if (userServiceMock.response.status === 200) {
                success(userServiceMock.response.body);
            }
            else {
                error(userServiceMock.response.body);
            }
        });

        windowServiceMock = jasmine.createSpyObj('window', ['open']);
        windowServiceMock.name = '';
        windowServiceMock.location = {
            href: ''
        };
        windowServiceMock.navigator = {
            language: 'en-US'
        };
        windowServiceMock.open.and.callFake(function (url, name) {
            windowServiceMock.location.href = url;
            windowServiceMock.name = name;
            return windowServiceMock;
        });

        $provide.value('userSvc', userServiceMock);
        $provide.value('$location', locationMock);
        $provide.value('translate', translateMock);
        $provide.value('$window', windowServiceMock);

    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, appSvc, $httpBackend, $location, loggerSvc, $translate, webStorage, $window) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        userService = userSvc;
        appService = appSvc;
        translate = $translate;
        webstorage = webStorage;
        window = $window;
    }));

    function initController() {
        controller('mainCtrl', {
            $scope: scope,
            userSvc: userService,
            loggerSvc: loggerService,
            appSvc: appService,
            $translate: translate,
            $location: location,
            webstorage: webstorage,
            $window: window
        });
    }

    describe('getAppConfig', function () {

        it('should fetch the app config on initialization', function () {
            initController();
            var appConfig = { aioUrl: 'www.yiptv.com'};
            httpBackend.expect('GET', '/api/get-app-config').respond(200, appConfig);
            httpBackend.flush();
            expect(scope.appConfig).toEqual(appConfig);
        });

        it('should fetch the app config on initialization', function () {
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            expect(scope.appConfig).toBe(undefined);
        });

        it('should log appropriate error message on error fetching app config', function () {
            initController();
            spyOn(loggerService, 'logError');
            httpBackend.expect('GET', '/api/get-app-config').respond(500);
            httpBackend.flush();
            expect(loggerService.logError).toHaveBeenCalledWith('Error fetching application configuration');
        });
    });

    describe('getAppConfig', function () {

        it('should set the $scope.currentRoute to current location', function () {
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            expect(scope.currentRoute).toEqual(location.path());
        });

    });

    describe('loadLanguage', function () {

        it('Should set the language to browser\'s default language', function () {
            webstorage.local.remove('language');
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            expect(translate.use()).toEqual(window.navigator.language.split('-')[0]);
            expect(webstorage.local.get('language')).toEqual(window.navigator.language.split('-')[0]);
            expect(scope.language).toEqual(window.navigator.language.split('-')[0]);
        });

        it('Should set the language to lang param in url', function () {
            urlParams = {lang: 'es'};
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            expect(translate.use()).toEqual('es');
            expect(webstorage.local.get('language')).toEqual('es');
            expect(scope.language).toEqual('es');
        });

        it('Should set the language to language value in local storage', function () {
            urlParams = {};
            webstorage.local.add('language', 'et');
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            expect(translate.use()).toEqual('et');
            expect(webstorage.local.get('language')).toEqual('et');
            expect(scope.language).toEqual('et');
        });

    });

    describe('changeLanguage', function () {

        it('Should set the language to es if the current language is en', function () {
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            translate.use('en');
            scope.changeLanguage();
            expect(translate.use()).toEqual('es');
            expect(webstorage.local.get('language')).toEqual('es');
            expect(scope.language).toEqual('es');
        });

        it('Should set the language to en if the current language is es', function () {
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            translate.use('es');
            scope.changeLanguage();
            expect(translate.use()).toEqual('en');
            expect(webstorage.local.get('language')).toEqual('en');
            expect(scope.language).toEqual('en');
        });

    })

    /*describe('openAio', function () {

        it('Should open new window with appropriate url on success', function () {
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200, { aioUrl: 'www.yiptv.com'});
            httpBackend.flush();
            expect(scope.appConfig).toEqual({ aioUrl: 'www.yiptv.com'});
            userServiceMock.setResponse(200, {username: 'varun', sso_token: 'hdeihf2i3e123'});
            scope.openAio();
            expect(window.location.href).toEqual(scope.appConfig.aioUrl + '/app/login.php?username=' + userServiceMock.response.body.username + '&sso_token=' + userServiceMock.response.body.sso_token);
        });

        it('Should log appropriate error message on error', function () {
            spyOn(loggerService, 'logError');
            initController();
            httpBackend.expect('GET', '/api/get-app-config').respond(200);
            httpBackend.flush();
            userServiceMock.setResponse(500, {});
            scope.openAio();
            expect(loggerService.logError).toHaveBeenCalledWith('Error opening video portal');
        });

    });*/

});
