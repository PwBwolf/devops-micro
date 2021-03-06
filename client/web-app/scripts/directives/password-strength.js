(function (app) {
    'use strict';

    app.directive('passwordStrength', ['$', function ($) {
        return {
            replace: false,
            restrict: 'A',
            scope: {passwordModel: '=passwordStrength'},
            link: function (scope, element) {
                var strength = {
                    colors: ['#F00', '#F90', '#E6E600', '#33CC33', '#1CAF9A'],
                    measureStrength: function (password) {
                        if(!password) {
                            return 5;
                        }
                        var force = 0,
                            regex = /[$*()\\=+@%&#-/:-?{-~!"^_`\[\]]/g,
                            lowerLetters = /[a-z]+/.test(password),
                            upperLetters = /[A-Z]+/.test(password),
                            numbers = /[0-9]+/.test(password),
                            symbols = regex.test(password),
                            flags = [lowerLetters, upperLetters, numbers, symbols],
                            passedMatches = $.grep(flags, function (el) {
                                return el === true;
                            }).length;
                        if (password.length < 6 || passedMatches === 0) {
                            force = 5;
                        } else if (passedMatches === 1) {
                            force = 15;
                        } else if (passedMatches === 2) {
                            force = 25;
                        } else if (passedMatches === 3) {
                            force = 35;
                        } else {
                            force = 45;
                        }
                        return force;
                    },
                    getColor: function (strength) {
                        var index = 0;
                        if (strength <= 10) {
                            index = 0;
                        } else if (strength <= 20) {
                            index = 1;
                        } else if (strength <= 30) {
                            index = 2;
                        } else if (strength <= 40) {
                            index = 3;
                        } else {
                            index = 4;
                        }
                        return {index: index + 1, color: this.colors[index]};
                    }
                };

                scope.$watch('passwordModel', function () {
                    var color = strength.getColor(strength.measureStrength(scope.passwordModel));
                    element.css({'display': 'inline'});
                    element.children('li').css({'background': '#DDD'}).slice(0, color.index).css({'background': color.color});
                });
            },
            template: '</li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
        };
    }]);
}(angular.module('app')));
