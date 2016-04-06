four51.app.controller('kitProductViewCtrl', ['$routeParams', '$scope', 'KitProductDisplayService', '$modal', 'Order', 'User', '$location', '$route', function ($routeParams, $scope, KitProductDisplayService, $modal) {
	$scope.LineItem = {};
	$scope.LineItem.Product = $scope.p;
	KitProductDisplayService.setNewLineItemScope($scope);
	KitProductDisplayService.setProductViewScope($scope);
	
	$scope.animationsEnabled = true;

    $scope.open = function () {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'viewLightboxModal.html',
            controller: 'lightboxModalCtrl',
            resolve: {
              scope: function () {
              return $scope;
        }
      }
        });
    };
	
}]);


four51.app.controller('lightboxModalCtrl', function ($scope, $modalInstance, scope) {
	
	$scope.LineItem = scope.LineItem;
	
    $scope.ok = function () {
    	$modalInstance.close();
    };

    $scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
    };
});