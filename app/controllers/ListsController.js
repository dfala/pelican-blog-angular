angular.module('Pelican')

.controller('ListsController', ['$scope', 'apiService', 'validator', function ($scope, apiService, validator) {

  //INIT
  $scope.init = function (user, lists) {
    if (user) $scope.user = user;
    if (lists) $scope.lists = lists
    console.log($scope.user, $scope.lists);
  };

  $scope.openPost = function (post) {
    $scope.activePost = post;
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
  }

}]);
