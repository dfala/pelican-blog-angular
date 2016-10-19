angular.module('Pelican')

.controller('DiscoverController', ['$scope', '$rootScope', 'apiService', 'validator', 'trackingService',
  function ($scope, $rootScope, apiService, validator, trackingService) {

  $scope.init = function () {
    if (p.user) $scope.user = p.user || null;
    if (p.lists) $scope.lists = p.lists;
    if (window.location.href.indexOf('/discover') > -1 && p.posts) $scope.posts = p.posts || [];
    else $scope.posts = sortPopularPosts();
  };

  function sortPopularPosts () {
    p.posts = p.posts.map(function (post) {
      var t = Math.abs(new Date() - new Date(post.metric.created_date)) / 36e5;
      post.trending = (post.metric.guestClick) / Math.pow(t + 2, 1.5);
      console.log(post.trending);
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

  $rootScope.$on('new post created', function (e, post) {
    $scope.posts.unshift(post);
  })

  $scope.openPost = function (post) {
    $scope.activePost = post;
    $('body').css({
      'overflow': 'hidden',
      'marginRight': '15px'
    });
    trackingService.trackConsumedPost(post);
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
    $('body').css({
      'overflow': 'inherit',
      'marginRight': '0'
    });
  };

  $scope.repin = function (activePost) {
    $rootScope.$emit('repin post', {
      title: activePost.title,
      link: activePost.link,
      text: activePost.text
    },100)
  };

  $scope.deletePost = function (postToDelete) {
    alertify.confirm("Are you sure you want to delete this post? This action cannot be undone.", function () {
      apiService.deletePost(postToDelete)
      .then(function (response) {
        // $rootScope.$emit('post deleted', postToDelete);
        $scope.posts = $scope.posts.filter(function (post) {
          if (post._id === postToDelete._id) return false;
          return true;
        })
        $scope.closePostModal();
        alertify.success('The post has been deleted.');
      })
      .catch(function (err) {
        console.error(err);
        alertify.error('There was a problem with deleting your post.');
      })
    });
  }

  $scope.turnOffEditPost = function () {
    $scope.editingPost = false;
  };

  $scope.turnOnEditPost = function () {
    if ($scope.editingPost) return $scope.turnOffEditPost();
    $scope.editingPost = true;
    $scope.editablePost = angular.copy($scope.activePost);
  };

  $scope.updatePost = function (post) {
    try { validator.validateNewPost(true, post) } catch (err) { return alertify.error(err); }
    if (post.link) {
      try {
        post.link = validator.verifyLink(post.link)
      } catch (err) {
        return alertify.error(err);
      }
    }

    apiService.updatePost(post)
    .then(function (response) {
      $scope.activePost = response.data;
      $scope.editingPost = false;

      // $rootScope.$emit('post edited', $scope.activePost);

      $scope.posts = $scope.posts.map(function (post) {
        if (post._id === response.data._id) return response.data;
        return post;
      });

      alertify.success('Your changes were successfully saved.');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

  $rootScope.$on('search for post', function (e, data) {
    if (!$scope.posts || $scope.posts.length < 1) return;

    for (var i = 0; i < $scope.posts.length; i++) {
      if ($scope.posts[i]._id === data.postId) return $scope.openPost($scope.posts[i]);
    };
  })
}]);
