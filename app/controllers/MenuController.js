angular.module('Pelican')

.controller('MenuController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.init = function (user, lists) {
    $scope.user = user;
    $scope.lists = lists;
  };

  $scope.makeActive = function (activeList) {
    $scope.lists = $scope.lists.map(function (list) {
      list.displayPosts = false;
      return (list);
    })
    activeList.displayPosts = true;
  };

  $scope.sanitizeHtml = function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
