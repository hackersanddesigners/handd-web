/**
 * Created by lucianblankevoort on 08/10/15.
 */
myApp.controller('LeftCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });
        };
}]);