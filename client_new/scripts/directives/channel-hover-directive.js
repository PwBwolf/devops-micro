(function (app){
    'use strict';

    app.directive('channelHover', function($log, $window){
        return {
            restrict: 'E',
            replace: true,
            template: '<div data-ng-bind-html=details></div>',
            link: function(scope, el, attrs){
                var scrns = $window.document.getElementById('scrns');
                var smm = $window.document.getElementById('teir_2');
                var chnls = $window.document.getElementById('chnlMenuHldr');
                var guide = $window.document.getElementById('userguide');
                var qlBox = $window.document.getElementsByClassName('quickLookBox');
                
                attrs.$set('class', 'smChnlDesc ease');
                attrs.$set('id', 'smChannelDesc');
                
                
                el.closest('li').bind('click', function() {
                    //console.log($(scrns).attr('class'));
                    if( $(scrns).hasClass("scrnsOpen" )){
                    //if(el){
                        //scope.test = "it's ";
                        $(qlBox).attr('class', 'off');
                        $(smm).attr('class', 'sgstdChnls_min');
                        $(scrns).attr('class', 'scrnsMinimize');
                        $(chnls).attr('class', 'usr_Prefs_pnl_max');
                        $(guide).attr('class', 'usr_Guide_pnl_min');
                        
                        attrs.$set('class', '');
                        attrs.$set('id', 'smChannelDesc_off');
                    //} else {
                        //console.log($(qlBox).attr('class')+' - ailed');
                        //scope.isVisible = true;
                        $(scrns).removeClass('scrnsOpen');
                        
                    }
                    
                });
                
                
                //attrs.$set('channel-expander', '');

                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
            }
        }
    });

}(angular.module('app')));