describe('directive: autofocus', function() {
    var elem, scope, timeout;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile, $timeout) {
        elem = angular.element('<input autofocus type="text">');
        scope = $rootScope;
        timeout = $timeout;
        $compile(elem)(scope);
        scope.$digest();
    }));

    describe('autofocus', function () {
        it('should set the focus on element on timeout', function () {
            spyOn(elem[0], 'focus');
            timeout.flush();
            expect(elem[0].focus).toHaveBeenCalled();
        });
    });

});