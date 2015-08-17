(function (app){
    'use strict';

    app.directive('channelLineup', function(){
        return {
            restrict: 'A',
            replace: true,
            template: '<div></div>',
            link: function(scope, el, attrs){

                attrs.$set('class', 'chnlDesc');
                attrs.$set('id', 'channelGuideDesc');
            }
        }
    });

}(angular.module('app')));
