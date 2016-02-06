(function() {
    angular
        .module('app')
        .directive('pipScreen', ppTv);

    function ppTv() {
        return {
            restrict: 'E',
            scope: {
                whichTv: '=info'
            },
            link: function (scope, element, attributes) {

                attributes.$observe('playurl', function(value) {
                    jwplayer(attributes.id).setup({
                        width: '100%',
                        height: 360,
                        file: value,
                        image: '@channelLogo',
                        primary: 'flash',
                        autostart: true,
                        fallback: true,
                        androidhls: true,
                        type: 'hls'
                    });

                })

            }
        };
    }
})()








