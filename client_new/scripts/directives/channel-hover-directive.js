(function (app){
	'use strict';
	
	app.directive('channelHover', function($log, $window){
        //var html = '<div>details</div>';
        //var compHtml = $compile(html);
		return {
			restrict: 'A',
			replace: true,
			template: '<div ng-bind-html=details></div>',
			link: function(scope, el, attrs){
                var promoChnlsCntnr = $window.document.getElementById('scrns');
                var chnlGuide = $window.document.getElementById('userguide');
                
				attrs.$set('testAttr', 'timing');
				attrs.$set('id', 'smChannelDesc');
                attrs.$set('class', 'smChnlDesc');
                
                $(promoChnlsCntnr).attr('class', 'scrnsMinimize').find('#teir_2').attr('class', 'sgstdChnls_min');
                $(chnlGuide).attr('class', 'usr_Guide_pnl_min ease');
				//$log.log('poster image submitted: '+el.html());
				//$log.log('ID attr set to: '+attrs.testAttr);
			}
		}
	});

}(angular.module('app')));