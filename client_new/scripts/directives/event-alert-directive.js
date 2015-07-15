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
                //var text = [];
                var counter = 0;
                
                console.log(usrName);
                //var counter = 0;
                var text = ["Hello, Welcome to YipTV", " I like tacos and mexican food"];
                //var text = [];
                //var text = mrqeData.message;
                //var scrollBox = $window.document.getElementById("my_text");
                //var scrollText = $(scrollBox).html(text[counter]);
                setInterval(change, 5000);
                function change() {
                    //$window.document.getElementById("my_text"); //.innerHTML = text[counter];
                    //scrollText;
                    $(scrollBox).html(text[counter]);
                    counter++;
                    if(counter >= text.length) { counter = 0; }
                    console.log(counter);
                }
                /*
                for (var m in scope.mrqeData){
                    if(scope.mrqeData.length > 0){
                        if(scope.mrqeData[m].type === 'e'){
                            
                            text[m] = scope.mrqeData[m].message;
                            //$(eventBox).toggleClass('btn-danger');
                            //$(eventBox).switchClass('btn-info', 'btn-danger', 500, 'easeInOutQuad');
                			//var text[m] = $filter('filter')(scope.mrqeData[m], {type:'e'})[0];
                            
                            } else {
                                text[m] = "not event";
                                //$(eventBox).switchClass('btn-danger', 'btn-info', 500, 'easeInOutQuad');
                                //$(eventBox).toggleClass('btn-info')
                                
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
                
                setInterval(change, 15000);
                function change() {
                    scrollBox.innerHTML = text[counter];
                    counter++;
                    if(counter >= text.length) { counter = 0; }
                }
                //attrs.$set('testAttr', 'timing');
                //attrs.$set('id', 'my-player');
                //$log.log('poster image submitted: '+el.html());
                //$log.log('ID attr set to: '+attrs.testAttr);
                //var counter = 0;
                //var text = ["<marquee>Hello</marquee>", "<marquee>I like tacos</marquee>"];
                /*var text = [];
                var text = mrqeData.message;
                var scrollBox = $window.document.getElementById("my_text");
                var scrollText = $(scrollBox).html(text[counter]);
                setInterval(change, 5000);
                function change() {
                    //$window.document.getElementById("my_text"); //.innerHTML = text[counter];
                    scrollText;
                    counter++;
                    if(counter >= text.length) { counter = 0; }
                }*/
            }
        }
    });

}(angular.module('app')));
