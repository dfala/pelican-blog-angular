angular.module('Pelican')

.controller('MenuController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.init = function (user, lists) {
    $scope.user = user;
    $scope.lists = lists;
  };

  $scope.sanitizeHtml = function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
