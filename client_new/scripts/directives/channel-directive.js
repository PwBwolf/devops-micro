(function (app){
	'use strict';
	
	app.directive('prodChannel', function($filter){
		return {
            restrict: 'A',
            template: '<div></div>',        
            link: function(scope, element, attrs){
                
                attrs.$set('chnl', ''+scope.dStation );

                attrs.$set('style', 'background: rgba(200,200,200,0.80) url('+scope.getImage(scope.dLogo)+') 50% no-repeat); background-size:contain;');
                
                var chnlLogo = angular.element(document.createElement('div'));
                $(chnlLogo).attr('id', 'chnl-guide-logo').attr('class', 'guide-logo');
                element.append(chnlLogo);
                
            }
        }
	});

}(angular.module('app')));
