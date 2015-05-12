describe('directive: complex-password', function() {
    var elm, scope, form;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile) {
        elm = angular.element('<form name="form"><input type="password" ng-model="model.somePassword" name="somePassword" complex-password /></form>');
        scope = $rootScope;
        scope.model = { somePassword: null };
        $compile(elm)(scope);
        form = scope.form;
    }));

    describe('valid password', function () {

        it('should fail if only lowercase characters in password', function () {
            var passwords = ['password', 'mypassword', 'testpass', 'verysecure'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only uppercase characters in password', function () {
            var passwords = ['PASSWORD', 'MYPASSWORD', 'TESTPASS', 'VERYSECURE'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only special characters characters in password', function () {
            var passwords = ['$@#_&^%!', '*_()&$@!#', '(*%^&@#$)', '*^&*%(^)$'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only numbers in password', function () {
            var passwords = ['12345678', '987654321', '345673456', '234576543'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only lowercase characters and uppercase characters in password', function () {
            var passwords = ['Password', 'MyPassword', 'tEStPass', 'vErysEcurE'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only lowercase characters and special characters in password', function () {
            var passwords = ['pa$$word', 'my@password', 't@stp@ss', 'v#rys@cur!'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only lowercase characters and numbers in password', function () {
            var passwords = ['password123', 'myp2s2wo3d', '1test234', 'v3rys3cur3'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only uppercase characters and special characters in password', function () {
            var passwords = ['PA$$WORD', 'MYP@SSWORD', 'T#%TP@SS', 'VER#S#C&R!'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only uppercase characters and numbers in password', function () {
            var passwords = ['P2SSW3RD', '23PASWOR34', 'TEST1234', 'V3RYS3CUR3'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });
        it('should fail if only special characters and numbers in password', function () {
            var passwords = ['@#$1234', '124&*(^%', '!@34%^78', '@#$654!@54'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });

        it('should fail if password length is less than 8 characters', function () {
            var passwords = ['P@ss12', 'Pa$$12', 'T@s1', 'V3rS123'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(false);
            });
        });

        it('should success if password length is more than or equal to 8 characters and has at least one uppercase, one lower case, one number and one special character', function () {
            var passwords = ['P@ss1234', 'Password@12', 'T@st1234', 'V#rS1234'];
            passwords.forEach(function (password) {
                form.somePassword.$setViewValue(password);
                scope.$digest();
                expect(scope.model.somePassword).toEqual(password);
                expect(form.somePassword.$valid).toEqual(true);
            });
        });

    });

});