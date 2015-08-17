(function (app){
    'use strict';

    app.directive('eventAlert', function($filter, $window){
        return {
            restrict: 'A',
            replace: true,
            template: '<marquee class="isclass">text</marquee>',
            link: function(scope, el, attrs){
                var scrollBox = $window.document.getElementById("my_text");
                var eventBox = $window.document.getElementById("alert");
                var usrName = $window.document.getElementById("uName").innerHTML;
                var counter = 0;
                
                console.log(usrName);
                var text = ["Hello, Welcome to YipTV", " I like tacos and mexican food"];
              
                setInterval(change, 5000);
                function change() {

                    $(scrollBox).html(text[counter]);
                    counter++;
                    if(counter >= text.length) { counter = 0; }
                    console.log(counter);
                }
         
            }
        }
    });

}(angular.module('app')));
