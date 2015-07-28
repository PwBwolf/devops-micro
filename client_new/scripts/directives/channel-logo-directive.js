(function (app){
    'use strict';
    
    app.directive('mylogo', function () {
        return {
            restrict: 'E',
            replace: true, 
            template: '<div data-ng-show=logoVisible; style="background:rgba(200,200,200,0.85) url({{channelIndex}}) 50% no-repeat; background-size: contain;"></div>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'channelBrand');
                attrs.$set('class', 'brand_logo ');
                //attrs.$set('listIndex', scope.channelIndex);
                console.log('current channel: '+scope.channelIndex);
                
                scope.logoVisible = true;
                
            }
        };
    })


});