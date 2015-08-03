(function (app){
    'use strict';

    app.directive('channelLineup', function($log, $window, $compile){
        return {
            restrict: 'A',
            replace: true,
            //template: '<div data-ng-bind-html=dChnlLnup></div>',
            template: '<div></div>',
            link: function(scope, el, attrs){
                //var template = '<div data-ng-bind-html=dChnlLnup></div>';
                //var linkShow = $compile(template);
                //var dCntnt = linkShow(scope);
                //el.append(dCntnt);
                
                
                //var dShow = [];
                    //dShow = el.find('div');
                    
                
                //$(dShow).attr('width', ''+scope.timeS);
                //scope.v = scope.inLineup.length;
                //for(var k in v){
                    
                //}
                attrs.$set('class', 'chnlDesc');
                //attrs.$set('style', 'width:'+timeSpan);
                attrs.$set('id', 'channelGuideDesc');
                //console.log('shows: '+dShow.length);
            }
        }
    });
    //.attachDirective('div', 'channelLineup');

}(angular.module('app')));