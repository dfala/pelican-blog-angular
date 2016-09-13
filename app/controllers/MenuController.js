angular.module('Pelican')

.controller('MenuController', ['$scope', function ($scope) {
  $scope.init = function (user, lists) {
    $scope.user = user;
    $scope.lists = lists;
  };
}]);
