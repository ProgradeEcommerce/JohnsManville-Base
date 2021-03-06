four51.app.controller('Four51Ctrl', ['$scope', '$route', '$location', '$451', 'User', 'Order', 'Security', 'OrderConfig', 'Category', 'AppConst','XLATService',
function ($scope, $route, $location, $451, User, Order, Security, OrderConfig, Category, AppConst, XLATService) {
	$scope.AppConst = AppConst;
	$scope.navVisible = false;
	$scope.scroll = 0;
	$scope.isAnon = $451.isAnon; //need to know this before we have access to the user object
	$scope.Four51User = Security;
	
	if ($451.isAnon && !Security.isAuthenticated()) {
		User.login(function () {
			$route.reload();
		});
	}

	// fix Bootstrap fixed-top and fixed-bottom from jumping around on mobile input when virtual keyboard appears
	if ($(window).width() < 960) {
		$(document)
			.on('focus', ':input:not("button")', function (e) {
				$('.navbar-fixed-bottom, .headroom.navbar-fixed-top').css("position", "relative");
			})
			.on('blur', ':input', function (e) {
				$('.navbar-fixed-bottom, .headroom.navbar-fixed-top').css("position", "fixed");
			});
	}

	function init() {
		if (Security.isAuthenticated()) {
			User.get(function (user) {
				$scope.user = user;
                $scope.user.Culture.CurrencyPrefix = XLATService.getCurrentLanguage(user.CultureUI, user.Culture.Name)[1];
                $scope.user.Culture.DateFormat = XLATService.getCurrentLanguage(user.CultureUI, user.Culture.Name)[2];

	            if (!$scope.user.TermsAccepted)
		            $location.path('conditions');

				if (user.CurrentOrderID) {
					Order.get(user.CurrentOrderID, function (ordr) {
						$scope.currentOrder = ordr;
						OrderConfig.costcenter(ordr, user);
					});
				}
				else
					$scope.currentOrder = null;

				if (user.Company.GoogleAnalyticsCode) {
					analytics(user.Company.GoogleAnalyticsCode);
				}
				
				if (!$scope.isInPath('login') && !$scope.isInPath('landing') && !$scope.isInPath('register') && !$scope.isInPath('conditions') && !$scope.isInPath('contactus') && $scope.user.Type == 'TempCustomer') {
					if ($location.search().token)
						$location.path('login');
					else
						$location.path('landing');
				}
				
				angular.forEach($scope.user.CustomFields, function(field) {
					if (field.Name == 'JM-DealerNames') {
						$scope.dealers = field.Value.split('|');
					}
				});
					

			});
			Category.tree(function (data) {
				$scope.tree = data;
				$scope.$broadcast("treeComplete", data);
			});
		}
	}

	function analytics(id) {
		if (id.length == 0 || window.ga) return;
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', id, 'four51.com');
		ga('require', 'ecommerce', 'ecommerce.js');
	}

	try {
		trackJs.configure({
			trackAjaxFail: false
		});
	}
	catch(ex) {}

    $scope.errorSection = '';

    function cleanup() {
        Security.clear();
    }

    $scope.$on('event:auth-loginConfirmed', function(){
        $route.reload();
	});
	$scope.$on("$routeChangeSuccess", init);
    $scope.$on('event:auth-loginRequired', cleanup);
    
    $scope.hideNav = function () {
        if ($scope.isInPath('landing') || $scope.isInPath('login') || $scope.isInPath('register') || $scope.isInPath('catalog') || ($scope.isInPath('conditions') && $scope.user.Type == 'TempCustomer') || ($scope.isInPath('contactus') && $scope.user.Type == 'TempCustomer'))
            return 'ng-hide';
    }
    
    $scope.containerOverflow = function () {
        if ($location.path().indexOf('catalog') != -1)
            return 'container-hide-overflow';
    }
    
    $scope.isInPath = function(path) {
        var cur_path = $location.path().replace('/', '');
        var result = false;

        if(cur_path.indexOf(path) > -1) {
            result = true;
        }
        else {
            result = false;
        }
        return result;
    };
}]);