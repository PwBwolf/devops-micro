(function (app){
    'use strict';

    app.directive('eventAlert', function($filter, $window){
        return {
            restrict: 'A',
            replace: true,
            template: '<marquee class="isclass" data-ng-show="counter == {{counter}}" data-ng-repeat="mrq in mrqeData" translate="{{mrq.message}}">Welcome to YipTV!</marquee>',
            link: function(scope, el, attrs){
                var scrollBox = $window.document.getElementById("my_text");
                var text = [];
                //var counter = 0;
                //attrs.$set('translate', '{{mrq.message}}');
                
                //var wndw = $window.document.getElementsByClassName('isclass');
                //for (var w in wndw){
                    //$(wndw[counter]).attr('isVisible', 'true');
                    //}
                
                
                /*/// working to place message var into translate ///
                for (var m in scope.mrqeData){
                    if(scope.mrqeData.length > 0){
                        if(scope.mrqeData[m].type === 'e'){
                            text[m] = scope.mrqeData[m].message;
                			//var text[m] = $filter('filter')(scope.mrqeData[m], {type:'e'})[0];
                        } else {
                            text[m] = 'trip';
                        }
                        //console.log('leng: '+$scope.mrqeData.length);
                        //text[m] = scope.mrqeData[m].message;
                        //console.log('text leng: '+$scope.mrqeData[counter].type);
                    } else {
                        text = "Thank you for signing up for yiptv";
                    }
    
                    console.log(m);
                    //console.log('its: '+$(text).length);
                    //var scrollText = $(scrollBox).html(text)[counter];
                }
                */
                /*
                var text = scope.mrqeData;
                                setInterval(change, 5000);
                                function change() {
                                    //attrs.$set('translate', 'text[counter]');
                                    //scrollBox.innerHTML = text[counter];
                                    
                                    //$(scrollBox).attr('ng-translate', text[counter]);
                                    //scope.crntMrqe(counter);
                                    counter++;
                                    
                                    if(counter >= text.length) { counter = 0; }
                                    console.log(counter);
                                }*/
                
               
            }
        }
    });

}(angular.module('app')));
