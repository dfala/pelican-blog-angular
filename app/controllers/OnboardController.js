angular.module('Pelican')

.controller('OnboardController', ['$scope', '$rootScope', 'apiService', function ($scope, $rootScope, apiService) {

  $scope.init = function () {
    $scope.active = 1;
  };

  $scope.next = function () {
    $scope.active = $scope.active + 1;
  };

  $scope.previous = function () {
    $scope.active = $scope.active - 1;
  };

  $scope.goTo = function (numb) {
    $scope.active = numb;
  };


}]);
