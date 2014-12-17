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
    beforeEach(inject(function ($controller, $rootScope, appSvc, $httpBackend, $http) {
        scope = $rootScope.$new();
        controller = $controller;
        loggerService = {};
        httpBackend = $httpBackend;
        appService = appSvc;
    }));

    function setupController() {
        controller('contactUsCtrl', {
            $scope: scope,
            appSvc: appService
        });
    }

    it('should attach a list of the countries', function () {
        httpBackend.when("GET","/api/get-countries").respond(200,['USA', 'SPAIN']);
        setupController();
        httpBackend.flush();
        expect(scope.countries.length).toBe(2);
        expect(scope.mv.country).toBe('United States');
    });

    it('should show appropriate error message on error', function () {
        httpBackend.when("GET","/api/get-countries").respond(404,[]);
    });

});