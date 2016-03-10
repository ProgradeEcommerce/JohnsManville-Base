four51.app.controller('LandingCtrl', ['$scope','$location','Order','User','Category','Product', function ($scope,$location,Order,User,Category,Product) {
	
    $scope.goSalesSupport = function () {
		if ($scope.cartCount && $scope.CrossPageVars.currentCategory && $scope.CrossPageVars.currentCategory.InteropID != 'MillSalesSupportItems') {
			cancelOrder();
		}
		$scope.CrossPageVars = {};
        Category.get('MillSalesSupportItems', function(cat) {
            $scope.CrossPageVars.currentCategory = cat;
			console.log($scope.CrossPageVars);
	        $scope.categoryLoadingIndicator = false;
			$scope.saveCrossPageVars($scope.CrossPageVars);
        	$location.path('/catalog/MillSalesSupportItems/');
        });
    }

    $scope.goCompanyStore = function () {
		if ($scope.cartCount && $scope.CrossPageVars.currentCategory && $scope.CrossPageVars.currentCategory.InteropID != 'MillCompanyStore') {
			cancelOrder();
		}
		$scope.CrossPageVars = {};
        Category.get('MillCompanyStore', function(cat) {
            $scope.CrossPageVars.currentCategory = cat;
	        $scope.categoryLoadingIndicator = false;
			$scope.saveCrossPageVars($scope.CrossPageVars);
        	$location.path('/catalog/MillCompanyStore/')
        });
    }

	function cancelOrder() {
		if (confirm('Navigating down this path will clear your current cart. Do you wish to continue?') == true) {
			$scope.displayLoadingIndicator = true;
			$scope.actionMessage = null;
			Order.delete($scope.currentOrder,
				function(){
					$scope.currentOrder = null;
					$scope.user.CurrentOrderID = null;
					User.save($scope.user, function(){
					});
					$scope.displayLoadingIndicator = false;
					$scope.actionMessage = 'Your Changes Have Been Saved';
				},
				function(ex) {
					$scope.actionMessage = 'An error occurred: ' + ex.Message;
					$scope.displayLoadingIndicator = false;
				}
			);
		}
	};
}]);