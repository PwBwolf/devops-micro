'use strict';

describe('Controller: contactUsCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        q,
        appService,
        loggerService,
        httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q, loggerSvc, appSvc, $httpBackend) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        loggerService = loggerSvc;
        httpBackend = $httpBackend;
        httpBackend.when("GET","/api/getCountries").respond(200,['USA', 'SPAIN']);
        appService = appSvc;
    }));

    function setupController() {
        controller('contactUsCtrl', {
            $scope: scope,
            appSvc: appService
        });
    }

    it('should attach a list of the countries', function () {
        setupController();
    });
});