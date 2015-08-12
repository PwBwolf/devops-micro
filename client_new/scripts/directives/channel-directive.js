(function (app){
	'use strict';
	
	app.directive('prodChannel', function($filter){
		return {
            restrict: 'A',
            //replace: true,
            template: '<div></div>',        
            link: function(scope, element, attrs){
                
                attrs.$set('chnl', ''+scope.dStation );
                
                
                //attrs.$set('id', 'chnl-guide-logo');
                //attrs.$set('class', 'guide-logo');
                attrs.$set('style', 'background: rgba(200,200,200,0.80) url('+scope.getImage(scope.dLogo)+') 50% no-repeat); background-size:contain;');
                
                var chnlLogo = angular.element(document.createElement('div'));
                $(chnlLogo).attr('id', 'chnl-guide-logo').attr('class', 'guide-logo');
                element.append(chnlLogo);
                
                /*
                var format;
        
                scope.$watch(attrs.myProdChannel, function(value) {
                    format = value;
                    getShows();
                });
        
                function getShows(){
                    var t = $filter('date')(new Date(), 'h:mm:ss a');
                    element.text(t);
                    //console.log(dt+' times');
                }
        
                function updateLater() {
                    setTimeout(function() {
                      updateTime(); // update DOM
                      updateLater(); // schedule another update
                    }, 1000);
                }
        
                updateLater();
                */
            }
        }
	});

}(angular.module('app')));
