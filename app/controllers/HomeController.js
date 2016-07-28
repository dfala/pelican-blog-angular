angular.module('Pelican')

.controller('HomeController', ['$scope', function ($scope) {
  $scope.openPost = function (post) {
    $scope.activePost = post;
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
  }
}]);
