'use strict';

describe('Controller: mainCtrl', function () {

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

    }));


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, appSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        controller('mainCtrl', {
            $scope: scope,
            userSvc: userSvc,
            loggerSvc: loggerSvc,
            appSvc : appSvc
        });
    }));

    it('should fetch the app config on initialization', function () {
        var appConfig = {"appName" : "YipTV", "customerCareNumber" : "800-123-1111"};
        httpBackend.when('GET', '/api/get-app-config').return(200, appConfig);
        httpBackend.flush();
        expect(scope.appConfig).toBe(appConfig);
        expect(scope.showHeader).toBe(true);
    });

    it('should log appropriate error message on error fetching app config', function () {
        spyOn(loggerService, 'logError');
        httpBackend.when('GET', '/api/get-app-config').return(500);
        httpBackend.flush();
        expect(loggerService.logError).toHaveBeenCalledWith('Error fetching application configuration');
    });

});
