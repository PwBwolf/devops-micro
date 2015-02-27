describe('directive: valid-email-list', function() {
    var elm, scope, form;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile) {
        elm = angular.element('<form name="form"><input type="text" ng-model="model.emailList" name="emailList" valid-email-list /></form>');
        scope = $rootScope;
        scope.model = { emailList: null };
        $compile(elm)(scope);
        form = scope.form;
    }));

    function createString(arr) {
        var list = '';
        for(var i=0; i<arr.length; i++) {
            list += arr[i];
            list += (i==(arr.length - 1))? '': ',';
        }
        return list;
    }

    describe('valid email list', function () {
        var validEmails = ['varun@yiptv.com', 'achinth@yiptv.us', 'vivek@yiptv.es', 'abc@yiptv.com'];
        var invalidEmails = ['varun#yiptv.com', 'achinth@yiptv', 'vivek$yiptv.com', 'yiptv.com'];

        it('should pass if every email in the list have valid format', function () {
            var emailList = createString(validEmails);
            form.emailList.$setViewValue(emailList);
            scope.$digest();
            expect(scope.model.emailList).toEqual(emailList);
            expect(form.emailList.$valid).toEqual(true);
        });

        it('should fail if one or more emails in the list do not have a valid format', function () {
            var emailList = createString(validEmails.concat(invalidEmails));
            form.emailList.$setViewValue(emailList);
            scope.$digest();
            expect(scope.model.emailList).toEqual(emailList);
            expect(form.emailList.$valid).toEqual(false);

            var arr = validEmails;
            arr.push(invalidEmails[1]);
            emailList = createString(arr);
            form.emailList.$setViewValue(emailList);
            scope.$digest();
            expect(scope.model.emailList).toEqual(emailList);
            expect(form.emailList.$valid).toEqual(false);

            emailList = createString(invalidEmails);
            form.emailList.$setViewValue(emailList);
            scope.$digest();
            expect(scope.model.emailList).toEqual(emailList);
            expect(form.emailList.$valid).toEqual(false);
        });


    });

});
