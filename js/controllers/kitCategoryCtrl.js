four51.app.controller('KitCategoryCtrl', ['$routeParams', '$sce', '$scope', '$451', 'Category', 'Product', 'Nav', '$location', '$modal', 'Order', 'User', 'ProductDisplayService',
function ($routeParams, $sce, $scope, $451, Category, Product, Nav, $location, $modal, Order, User, ProductDisplayService) {
	$scope.productLoadingIndicator = true;
	$scope.settings = {
		currentPage: 1,
		pageSize: 40
	};
	$scope.trusted = function(d){
		if(d) return $sce.trustAsHtml(d);
	}

	function _search() {
		$scope.searchLoading = true;
		Product.search($routeParams.categoryInteropID, null, null, function (products, count) {
			$scope.products = products;
			$scope.productCount = count;
			$scope.productLoadingIndicator = false;
			$scope.searchLoading = false;
		}, $scope.settings.currentPage, $scope.settings.pageSize);
	}

	$scope.$watch('settings.currentPage', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			_search();
	});

	if ($routeParams.categoryInteropID) {
	    $scope.categoryLoadingIndicator = true;
        Category.get($routeParams.categoryInteropID, function(cat) {
            $scope.currentCategory = cat;
	        $scope.categoryLoadingIndicator = false;
        });
    }
	else if($scope.tree){
		$scope.currentCategory ={SubCategories:$scope.tree};
	}


	$scope.$on("treeComplete", function(data){
		if (!$routeParams.categoryInteropID) {
			$scope.currentCategory ={SubCategories:$scope.tree};
		}
	});

	$scope.addToOrder = function(){
		if(!$scope.currentOrder){
			$scope.currentOrder = { };
			$scope.currentOrder.LineItems = [];
		}
		if (!$scope.currentOrder.LineItems)
			$scope.currentOrder.LineItems = [];
				
		angular.forEach($scope.products, function(p) {
			console.log('runnink');
			if(p.Quantity){
			console.log('runnink past eef');
				var LineItem = {};
				LineItem.Product = p;
				LineItem.Quantity = p.Quantity;
				LineItem.PriceSchedule = p.StandardPriceSchedule;
				$scope.qtyChanged(LineItem);
				if(!$scope.lineItemErrors){
					$scope.lineItemErrors = [];
				}
				if($scope.lineItemErrors.length){
					$scope.showAddToCartErrors = true;
					return;
				}
					
				if($scope.allowAddFromVariantList){
					angular.forEach($scope.variantLineItems, function(item){
						if(item.Quantity > 0){
							$scope.currentOrder.LineItems.push(item);
							$scope.currentOrder.Type = item.PriceSchedule.OrderType;
						}
					});
				}else if(LineItem.Quantity > 0){
					$scope.currentOrder.LineItems.push(LineItem);
					$scope.currentOrder.Type = LineItem.PriceSchedule.OrderType;
				}
				$scope.addToOrderIndicator = true;
			}
		});
		//$scope.currentOrder.Type = (!$scope.LineItem.Product.IsVariantLevelInventory && $scope.variantLineItems) ? $scope.variantLineItems[$scope.LineItem.Product.Variants[0].InteropID].PriceSchedule.OrderType : $scope.LineItem.PriceSchedule.OrderType;
		// shipper rates are not recalcuated when a line item is added. clearing out the shipper to force new selection, like 1.0
		Order.clearshipping($scope.currentOrder).
			save($scope.currentOrder,
				function(o){
					$scope.user.CurrentOrderID = o.ID;
					User.save($scope.user, function(){
						$scope.addToOrderIndicator = true;
						$location.path('/cart');
					});
				},
				function(ex) {
					$scope.addToOrderIndicator = false;
					$scope.lineItemErrors.push(ex.Detail);
					$scope.showAddToCartErrors = true;
					//$route.reload();
				}
		);
	};

	$scope.getRestrictedQtyText = function(priceBreak, qtyMultiplier){
		var qtyText = priceBreak.Quantity * qtyMultiplier;
		if(qtyMultiplier > 1)
			qtyText += ' (' + priceBreak.Quantity + 'x' + qtyMultiplier +')';
		return qtyText;
	};

	$scope.qtyChanged = function(lineitem){
		ProductDisplayService.calculateLineTotal(lineitem);
		if($scope.calculated)
			$scope.calculated(lineitem);
	};

	$scope.validQuantityAddToOrder = function(value, lineItem){
		var variant = lineItem.Variant;
		var product = lineItem.Product;
		var priceSchedule = lineItem.PriceSchedule;
			if(value == "" && !$scope.required)
		{
			lineItem.qtyError = null;
			return $scope.valid | true;
		}
		if(value == null){
			$scope.lineitem.qtyError = null;
			return $scope.valid | true;
		}
		
		if(!product && !variant)
			return $scope.valid | true;
			if(!priceSchedule)
			return $scope.valid | true;
			$scope.valid = true;
			if(!$451.isPositiveInteger(value))
		{
			$scope.lineitem.qtyError = "Please select a valid quantity";
			$scope.valid = false;
			return $scope.valid;
		}
		
		if(priceSchedule.MinQuantity > value){
			$scope.valid = false;
			$scope.lineitem.qtyError = "must be equal or greater than " + priceSchedule.MinQuantity;
		}
			if(priceSchedule.MaxQuantity && priceSchedule.MaxQuantity < value){
			$scope.lineitem.qtyError = "must be equal or less than " + priceSchedule.MaxQuantity;
			$scope.valid = false;
		}
			if(product.IsVariantLevelInventory && !variant){
			//console.log('variant not selected can\'t check qty available'); //in vboss the user may select the qty before the variant. we may have to change when this gets called so inventory available can be re validated if the variant is chnaged based on a selection spec. It's probably not a big deal since the api will check inventory available on adding to order.
		}
		else{
			var qtyAvail = (product.IsVariantLevelInventory ? variant.QuantityAvailable : product.QuantityAvailable) + (lineItem.OriginalQuantity || 0);
				if(qtyAvail < value && product.AllowExceedInventory == false){
					$scope.lineitem.qtyError = "cannot exceed the Quantity Available of " +  qtyAvail;
					$scope.valid = false;
			}
		}
		
		if($scope.valid)
			$scope.lineitem.qtyError = null;
			
		return $scope.valid;
	}
	
}]);