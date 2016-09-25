angular.module('Pelican')

.controller('DiscoverController', ['$scope', '$rootScope', function ($scope, $rootScope) {
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
