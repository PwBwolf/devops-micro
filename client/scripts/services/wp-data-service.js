(function (app) {
    'use strict';

    app.service('wpDataSvc', ['$log', '$http', '$q', 'toastr', function ($log, $http, $q, toastr) {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-full-width';
        toastr.options.closeButton = true;

        function logIt(message, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            write(message);
            if (toastType === 'error') {
                toastr.error(message);
            } else if (toastType === 'warning') {
                toastr.warning(message);
            } else if (toastType === 'success') {
                toastr.success(message);
            } else {
                toastr.info(message);
            }
        }
		
		return ({
			getWpData: getWpData,
			
		});
		
		function getWpData(){
			var req = $http({
				method: "get",
				//url: "http://www.yiptv.com/wp-content/themes/YipTV/footer.php/",
				url: "views/footer.php",
				
			})
			return (req.then(handleSuccess, handleError));
		}
		function handleError(response){
			if ( !angular.isObject(response.data) || !response.data.menu ){
				return( $q.reject(response.data));
			}
		}
		function handleSuccess(response){
			console.log('response: '+response.data);
			$('#wpdata').html(response.data);
			return (response.data);
			
		}
		
    }]);
})(angular.module('app'));
