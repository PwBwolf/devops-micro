(function (app){
    'use strict';

    app.directive('channelHover', function($log){
        return {
            restrict: 'A',
            replace: true,
            template: '<div data-ng-bind-html=details></div>',
            link: function(scope, el, attrs){
                attrs.$set('class', 'smChnlDesc');
                attrs.$set('id', 'smChannelDesc');
                //attrs.$set('channel-expander', '');

                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
            }
        }
    });

}(angular.module('app')));