(function (app){
    'use strict';

    app.directive('channelHover', function($log, $window){
        return {
            restrict: 'E',
            replace: true,
            template: '<div data-ng-bind-html=details></div>',
            link: function(scope, el, attrs){
           
                attrs.$set('class', 'smChnlDesc');
                attrs.$set('id', 'smChannelDesc');
                
                
                el.closest('li').on('click', function(evt) {
                    var target = $(this).prop("tagName").toLowerCase();
                        target = $(target).index(this);

                        scope.$apply(scope.getTarget(target));
                        
                        console.log('target: '+target);
                  
                        $(scope.guide).addClass('usrGuidePnlMin');
                        $(scope.chnls).switchClass('usrPrefsPnl', 'usrPrefsPnlMax', 500, 'easeInOutQuad');
                        
                        scope.$apply(scope.showCloseBtn());
                    
                });
                
            }
        }
    });

}(angular.module('app')));