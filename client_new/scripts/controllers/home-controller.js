(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', function (appSvc, $scope, $window, $location) {
        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

        $scope.imageMapClick = function (url) {
            if(url.charAt(0) === '/') {
                $location.path(url);
            } else {
                $window.open(url);
            }
        };

        $scope.onWebSliderChange = function () {
            angular.element($window).triggerHandler('resize');
        };
		
		
		
		/// ===================================== ///
		/// ====== ALDEN'S FUNCTIONS BELOW ====== ///
		
		
			$scope.usrDataFile = {
				"bnr": "vws/usrBnr.html",
				"shws": "vws/usrShws.html",
				"ntwrks": "vws/usrNtwrks.html",
				"dvcs": "vws/usrDvcs.html",
				"abt": "vws/usrAbt.html",
				"app": "vws/usrApp.html",
				"ftr": "vws/usrFtrMnu.html"
			};
		
			/// ====   PAGE AND BUTTON FUNCTIONS   ==== ///
			var mnuBtns = ['pgCntnt', 'Shws', 'Ntwrks', 'Abt', 'Orders'];
		
			/*
			$('#docklogo').on('click', function(){
							$('html, body').animate({
								scrollTop: 0,
							
							}, 1500);
						});*/
			
		
			for(var j = 0; j < 5; j++){
				$('#'+mnuBtns[j]).on('click', function(){
					var dPg = $(this).attr('id');
					//console.log(dPg);
					var dSite = $('html, body');
					    dSite.animate({
							scrollTop: $('#'+dPg+'_Bx').offset().top - 30
						}, 1500 );
					   console.log(dPg);
					
					return false;

				});
			};
		
		
		/// ====== ALDEN'S FUNCTIONS ABOVE ====== ///
		/// ===================================== ///
		
		
		
    }]);
}(angular.module('app')));
