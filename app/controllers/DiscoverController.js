angular.module('Pelican')

.controller('DiscoverController', ['$scope', '$rootScope', 'apiService', 'validator', 'trackingService',
  function ($scope, $rootScope, apiService, validator, trackingService) {

  $scope.init = function () {
    if (p.user) $scope.user = p.user || null;
    if (p.lists) $scope.lists = p.lists;
    if (window.location.href.indexOf('/trending') > -1 && p.posts) $scope.posts = sortPopularPosts();
    else $scope.posts = p.posts || [];
  };

  function sortPopularPosts () {
    p.posts = p.posts.map(function (post) {
      var t = Math.abs(new Date() - new Date(post.metric.created_date)) / 36e5;
      post.trending = (post.metric.guestClick) / Math.pow(t + 2, 1.5);
      return post;
    }).sort(function(a, b) {
      if (a.trending > b.trending) {
        return -1;
      }
      if (a.trending < b.trending) {
        return 1;
      }
      return 0;
    });
    return p.posts;
  };

  $scope.openPost = function (post) {
    $rootScope.$emit('open post modal', {
      post: post
    });
  };

  $rootScope.$on('new post created', function (e, post) {
    $scope.posts.unshift(post);
  })

  $rootScope.$on('post edited', function (e, editedPost) {
    for (var p = 0; p < $scope.posts.length; p++) {
      if ($scope.posts[p]._id === editedPost._id) {
        $scope.posts[p] = editedPost;
        return;
      }
    }
  });

  $rootScope.$on('post deleted', function (e, post) {
    $scope.posts = $scope.posts.filter(function (p) {
      if (p._id === post._id) return false;
      return true;
    });
  });

  $rootScope.$on('search for post', function (e, data) {
    if (!$scope.posts || $scope.posts.length < 1) return;

    for (var i = 0; i < $scope.posts.length; i++) {
      if ($scope.posts[i]._id === data.postId) return $scope.openPost($scope.posts[i]);
    };
  })
}]);
