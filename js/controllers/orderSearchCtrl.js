four51.app.controller('OrderSearchCtrl', ['$scope', '$location', 'OrderSearchCriteria', 'OrderSearch', 'Order', 'Address',
function ($scope,  $location, OrderSearchCriteria, OrderSearch, Order, Address) {
	$scope.settings = {
		currentPage: 1,
		pageSize: 10
	};

	OrderSearchCriteria.query(function(data) {
		$scope.OrderSearchCriteria = data;
		$scope.hasStandardTypes = _hasType(data, 'Standard');
		$scope.hasReplenishmentTypes = _hasType(data, 'Replenishment');
		$scope.hasPriceRequestTypes = _hasType(data, 'PriceRequest');
	});

	$scope.$watch('settings.currentPage', function() {
		Query($scope.currentCriteria);
	});

	$scope.OrderSearch = function($event, criteria) {
		$event.preventDefault();
		$scope.currentCriteria = criteria;
		Query(criteria);
	};

    function _hasType(data, type) {
        var hasType = false;
        angular.forEach(data, function(o) {
            if (hasType || o.Type == type && o.Count > 0)
                hasType = true;
        });
        return hasType;
    }

	function Query(criteria) {
		if (!criteria) return;
		$scope.showNoResults = false;
		$scope.pagedIndicator = true;
		OrderSearch.search(criteria, function (list, count) {
			$scope.orders = list;
			$scope.settings.listCount = count;
			$scope.showNoResults = list.length == 0;
			$scope.pagedIndicator = false;
			$scope.orderShips = [];
		
			angular.forEach($scope.orders, function(order) {
				Order.get(order.ID, function(data){
					order = data;
					if (order.IsMultipleShip()) {
						angular.forEach(data.LineItems, function(item) {
							if (item.ShipAddressID) {
								Address.get(item.ShipAddressID, function(add) {
									item.ShipAddress = add;
								});
							}
						});
					}
					else {
						Address.get(data.ShipAddressID || data.LineItems[0].ShipAddressID, function(add) {
							data.ShipAddress = add;
						});
					}
					Address.get(data.BillAddressID, function(add){
						data.BillAddress = add;
					});
					$scope.orderShips.push(data);
				}, true);
			});
			
			$scope.orders = $scope.orderShips;
			
		});
		$scope.orderSearchStat = criteria;
	}
}]);