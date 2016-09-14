angular.module('Pelican')

.controller('HomeController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.init = function (user, posts) {
    $scope.user = user || null;
    $scope.posts = posts || [];
  };

  $rootScope.$on('new post created', function (e, post) {
    $scope.posts.unshift(post);
  })

  $scope.openPost = function (post) {
    $scope.activePost = post;
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
  }
}]);
