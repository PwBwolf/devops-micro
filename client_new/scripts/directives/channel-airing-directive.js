(function (app){
	'use strict';
	
	app.directive('channelAiring', function($filter){
		return {
            restrict: 'A',
            //replace: true,
            template: '<div data-ng-bind-html=ChannelLineup></div>',        
            link: function(scope, element, attrs){
                
                attrs.$set('id', 'channelGuideDesc');
                attrs.$set('class', 'chnlDesc');
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
