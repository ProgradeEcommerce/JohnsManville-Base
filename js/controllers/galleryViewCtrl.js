four51.app.controller('galleryViewCtrl', ['$routeParams', '$scope', 'Order', 'User', '$location', '$route', '$http', function ($routeParams, $scope, Order, User, $location, $route, $http) {
	
    $scope.downloadableImages = [];
    
	$http.get('js/galleryJSON.json').then(function(response){
	    $scope.downloadableImages = response.data.Gallery;
	}, function(response){
	    console.log(response);
	});
	
	$scope.currentIndex = 0;
	$scope.currentImage = 0;
    $scope.currentDownload = 0;
    
    $scope.updateCurrentImage = function(i) {
        $scope.currentIndex = i;
    }
    
    $scope.previousImage = function() {
        if ($scope.currentIndex != 0)
            $scope.currentIndex -= 1;
    }
    
    $scope.nextImage = function() {
        if ($scope.currentIndex != $scope.downloadableImages.length - 1)
            $scope.currentIndex += 1;
    }
	
}]);