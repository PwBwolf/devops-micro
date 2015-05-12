describe('directive: sameAs', function() {
    var elem, scope, form;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile) {
        elem = angular.element('<form name="form"><input type="text" name="var2" same-as="model.var1" ng-model="model.var2" /></form>');
        scope = $rootScope.$new();
        scope.model = {
            var1: "value",
            var2: "value"
        };
        $compile(elem)(scope);
        scope.$digest();
        form = scope.form;
    }));

    describe('form', function () {

        it('should be set to valid if the var1 and var2 are equal', function () {
            expect(form.var2.$valid).toEqual(true);
        });

        it('should be set to invalid if the var1 and var2 are not equal', function () {
            scope.model.var2 = "new value";
            scope.$digest();
            expect(form.var2.$valid).toEqual(false);
        });

    });

});
