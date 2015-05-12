describe('directive: goto', function() {
    var elem, scope, location;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile, $location) {
        elem = angular.element('<div goto={{path}}></div>');
        scope = $rootScope.$new();
        scope.path = "/home";
        location = $location;
        $compile(elem)(scope);
        scope.$digest();
    }));

    describe('on element click', function () {

        it('should redirect to the path specified as an attribute', function () {
            spyOn(location, 'path');
            elem.triggerHandler('click');
            expect(location.path).toHaveBeenCalledWith('/home');
        });

        it('should redirect to the changed path on attribute value changed', function () {
            spyOn(location, 'path');
            scope.path="/login";
            scope.$digest();
            elem.triggerHandler('click');
            expect(location.path).toHaveBeenCalledWith('/login');
        });

    });

});
