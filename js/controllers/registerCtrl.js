four51.app.controller('RegisterCtrl', ['$scope', '$sce', '$route', '$location', 'User', function ($scope, $sce, $route, $location, User) {
	
    $scope.save = function () {
        $scope.actionMessage = null;
        $scope.securityWarning = false;
        $scope.user.Username = $scope.user.TempUsername;
        $scope.displayLoadingIndicator = true;
        if ($scope.user.Type == 'TempCustomer')
            $scope.user.ConvertFromTempUser = true;
            User.save($scope.user,
            function (u) {
                $scope.securityWarning = false;
                $scope.displayLoadingIndicator = false;
                $scope.actionMessage = 'Your changes have been saved';
                $scope.user.TempUsername = u.Username;
				$location.path('catalog');
            },
            function (ex) {
                $scope.displayLoadingIndicator = false;
                if (ex.Code.is('PasswordSecurity'))
                    $scope.securityWarning = true;
                else {
                    $scope.actionMessage = $sce.trustAsHtml(ex.Message);
                }
            }
        );
    };
	
}]);