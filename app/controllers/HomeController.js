angular.module('Pelican')

.controller('HomeController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  // TODO: DEPRECATE THIS CONTROLLER
  $scope.init = function (user, posts) {
    $scope.user = user || null;
    $scope.posts = posts || [];
  };

  $rootScope.$on('new post created', function (e, post) {
    $scope.posts.unshift(post);
  })

  $scope.openPost = function (post) {
    $scope.activePost = post;
    $('body').css({
      'overflow': 'hidden',
      'marginRight': '15px'
    });
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
    $('body').css({
      'overflow': 'inherit',
      'marginRight': '0'
    });
  };
}]);
