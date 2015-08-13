(function (app){
    'use strict';

    app.directive('channelHover', function($log, $window){
        return {
            restrict: 'E',
            replace: true,
            template: '<div data-ng-bind-html=details></div>',
            link: function(scope, el, attrs){
                /*
                var scrns = $window.document.getElementById('scrns');
                                var smm = $window.document.getElementById('teir_2');
                                var chnls = $window.document.getElementById('chnlMenuHldr');
                                var guide = $window.document.getElementById('userGuide');
                                var qlBox = $window.document.getElementsByClassName('quickLookBox');*/
                
                
                attrs.$set('class', 'smChnlDesc');
                attrs.$set('id', 'smChannelDesc');
                
                
                el.closest('li').bind('click', function(evt) {
                    //console.log($(this).attr('class'));
                    var target = $(this).prop("tagName").toLowerCase();
                        target = $(target).index(this);
                        scope.$apply(scope.getTarget(target));
                        console.log('target: '+target);
                    
                    //if( $(scope.scrns).hasClass("scrnsMaximized" )){
                    //if(el){
                        //scope.test = "it's ";
                        //$(e.target).attr('class', ':active');
                        //$(scope.qlBox).toggleClass('off');
                       //$(scope.smm).attr('class', 'sgstdChnls_min');
                        //$(scope.smm).switchClass('sgstdChnls', 'sgstdChnls_min', 500, 'easeInOutQuad');
                        //console.log('guide '+$(scope.guide).attr('id'));
                        //$(scope.guide).removeClass('usrGuidePnl').addClass('usrGuidePnlMin');
                       
                        //$(scope.guide).switchClass('usrGuidePnl', 'usrGuidePnlMin', 500, 'easeInOutQuad');
                        
                        $(scope.guide).addClass('usrGuidePnlMin');
                        $(scope.chnls).switchClass('usrPrefsPnl', 'usrPrefsPnlMax', 500, 'easeInOutQuad');
                        //$(scope.chnls).attr('class', 'usrPrefsPnlMax');
                        //$(scope.scrns).switchClass('scrnsMaximized', 'scrnsMinimized', 500, 'easeInOutQuad');
                        //$(guide).attr('class', 'usrGuidePnlMin');
                        
                        //el.toggleClass('off');
                        //attrs.$set('id', 'smChannelDesc');
                    //} else {
                        //console.log($(qlBox).attr('class')+' - ailed');
                        //scope.isVisible = true;
                        //$(scope.scrns).removeClass('scrnsOpen');
                        
                        //var target = $(this).attr('class');
                        //var target = $(this).prop("tagName").toLowerCase();
                        //target = $(target).index(this);
                        
                        scope.$apply(scope.showCloseBtn());
                        
                        //} else {
                        //console.log('screen\'s already open');
                        //}
                    
                });
                
                
                //attrs.$set('channel-expander', '');

                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
            }
        }
    });

}(angular.module('app')));