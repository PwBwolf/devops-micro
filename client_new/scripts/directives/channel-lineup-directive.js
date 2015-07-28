(function (app){
    'use strict';

    app.directive('channelLineup', function($log, $window){
        return {
            restrict: 'E',
            replace: true,
            template: '<div data-ng-bind-html=dChnlLnup></div>',
            link: function(scope, el, attrs){
                /*
                var scrns = $window.document.getElementById('scrns');
                                var smm = $window.document.getElementById('teir_2');
                                var chnls = $window.document.getElementById('chnlMenuHldr');
                                var guide = $window.document.getElementById('userguide');
                                var qlBox = $window.document.getElementsByClassName('quickLookBox');*/
                
                
                attrs.$set('class', 'chnlDesc');
                attrs.$set('id', 'channelGuideDesc');
                
                
                /*el.closest('li').bind('click', function(evt) {
                    //console.log($(this).attr('class'));
                    if( $(scope.scrns).hasClass("scrnsMaximized" )){
                    //if(el){
                        //scope.test = "it's ";
                        //$(e.target).attr('class', ':active');
                        $(scope.qlBox).toggleClass('off');
                       //$(scope.smm).attr('class', 'sgstdChnls_min');
                        $(scope.smm).switchClass('sgstdChnls', 'sgstdChnls_min', 500, 'easeInOutQuad');
                        //$(scope.chnls).switchClass('usrPrefsPnl', 'usrPrefsPnlMax', 500, 'easeInOutQuad');
                        $(scope.chnls).attr('class', 'usrPrefsPnlMax');
                        $(scope.scrns).switchClass('scrnsMaximized', 'scrnsMinimized', 500, 'easeInOutQuad');
                        //$(guide).attr('class', 'usr_Guide_pnl_min');
                        
                        //el.toggleClass('off');
                        //attrs.$set('id', 'smChannelDesc');
                    //} else {
                        //console.log($(qlBox).attr('class')+' - ailed');
                        //scope.isVisible = true;
                        $(scope.scrns).removeClass('scrnsOpen');
                        
                        scope.$apply(scope.showCloseBtn());
                        
                    } else {
                        console.log('screen\'s already open');
                    }
                    
                });*/
                
                
                //attrs.$set('channel-expander', '');

                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
            }
        }
    });

}(angular.module('app')));