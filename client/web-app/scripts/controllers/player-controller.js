(function(){
    'use strict'

    angular
        .module('app')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope','mediaSvc', '$window', '$rootScope', '$anchorScroll']

    function playerCtrl ($scope, mediaSvc, $window, $rootScope, $anchorScroll) {
        $scope.selectedPromo = -1;
        $scope.selectedGenres = [];
        $scope.selectedRegions = [];
        $scope.selectedAudiences = [];
        $scope.selectedLanguages = [];
        $scope.favoriteChannels = [];
        $scope.recentChannels = [];
        $scope.favoriteIcon = '../../images/favorite_white.png';
        $scope.channelLogo = '../../images/logo.png';
        $scope.programTitle = '';
        $scope.programDescription = '';
        $scope.showChannelFilter = false;
        var currentChannelIndex = {index: undefined, channelId: undefined};
        var previousChannelIndex = {index: undefined, channelId: undefined};
        activate();

        function activate() {
            mediaSvc.getUserChannels(function (data) {
                console.log(data)
                $rootScope.channels = data.channels_list;
                $rootScope.filteredChannels = $rootScope.channels;
                $rootScope.$broadcast('ChannelsLoaded');
            });
            //call to get current promotion that should be displayed on free users view
            mediaSvc.getPromos(function (data) {
                $scope.promos = data.ads;
            });

            mediaSvc.getChannelCategories(function (data) {
                var dataCategories = data.categories;
                $rootScope.channelCategories = data.categories;
                for(var i = 0; i < dataCategories.length; i++) {
                    var genre = dataCategories[i].tags;
                    for(var j = 0; j < genre.length; j++) {
                        if(j%2 == 0) {
                            $rootScope.channelCategories[i].tags[j].col = 0;
                        } else {
                            $rootScope.channelCategories[i].tags[j].col = 1;
                        }
                    }
                }
            });

            mediaSvc.getFavoriteChannels(
                function (data) {
                    $scope.favoriteChannels = data;
                    console.log('playerCtrl - favorite channels: ' + data.length);
                },
                function (error) {
                    console.log(error);
                }
            );
        }

    }
})()
