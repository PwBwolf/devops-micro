(function (app){
    'use strict';

    app.directive('channelExpander', function($log, $window){
        return {
            restrict: 'E',
            replace: true,
            //template: '<div>{{test}} time to do it<div data-ng-repeat="air in airings">{{air.program.title}}. Start-Time: {{air.startTime}} Runtime: {{air.duration}}</div></div>',
            template: '<div data-ng-bind-html=showListings></div>',
            link: function(scope, el, attrs){
                
                //el.prepend($(closeBtn));
                //var dEl = el.find($('div'));
                //console.log('amt: '+dEl.length);
                attrs.$set('id', 'channelPreviewPanel');
                attrs.$set('class', 'channelPreview');
                
                //var scrns = $window.document.getElementById('scrns');
                  //attrs.$set('channel-expander', '');
                //console.log($(scrns).length);
                //console.log('it works');
                //$(scrns).attr('class', 'scrnsMinimize');
                
                //attrs.$set('class', 'smChnlDesc');
                //attrs.$set('id', 'smChannelDesc');
                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
            }
        }
    });

}(angular.module('app')));