angular.module('Pelican')

.controller('PostModalController', ['$scope', '$rootScope', 'apiService', 'trackingService', 'validator', '$timeout',
function ($scope, $rootScope, apiService, trackingService, validator, $timeout) {

  $scope.openPost = function (post, postIndex, listIndex) {
    $scope.activePost = post;
    $scope.activePost.postIndex = postIndex;
    $scope.activePost.listIndex = listIndex;

    if (!$scope.activePost.likes || !p.user) $scope.likedPost = false;
    else $scope.likedPost = $scope.activePost.likes.indexOf(p.user._id) < 0 ? false : true;

    $('body').css({
      'overflow': 'hidden',
      'marginRight': '15px'
    });

    trackingService.trackConsumedPost(post);
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
    $scope.editingPost = false;
    $('body').css({
      'overflow': 'inherit',
      'marginRight': '0'
    });
  };

  $scope.repin = function (activePost) {
    $rootScope.$emit('repin post', {
      text: activePost.text,
      link: activePost.link,
      title: activePost.title
    })
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

      $rootScope.$emit('post edited', $scope.activePost);
      alertify.success('Your changes were successfully saved.');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

  // LIKE POST
  $scope.likePost = function (post) {
    apiService.likePost(post)
    .then(function (response) {
      $scope.likedPost = response.data.isLiked;
      $scope.activePost.likes = response.data.likes;
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('There was a problem with your request :(')
    })
  };

  // EDIT POST
  $scope.turnOffEditPost = function () {
    $scope.editingPost = false;
  };

  $scope.turnOnEditPost = function (index) {
    if ($scope.editingPost) return $scope.turnOffEditPost();

    $scope.editablePost = angular.copy($scope.activePost);
    $scope.editablePostIndex = index;
    $scope.editingPost = true;
    $timeout(function () {
      $('#post-title-edit').focus();
    })
  };

  $scope.deletePost = function (postToDelete) {
    alertify.confirm("Are you sure you want to delete this post? This action cannot be undone.", function () {
      apiService.deletePost(postToDelete)
      .then(function (response) {
        $rootScope.$emit('post deleted', postToDelete);
        $scope.closePostModal();
        alertify.success('The post has been deleted.');
      })
      .catch(function (err) {
        console.error(err);
        alertify.error('There was a problem with deleting your post.');
      })
    });
  };

  $rootScope.$on('open post modal', function (e, data) {
    $scope.openPost(data.post, data.postIndex, data.listIndex);
  });

}]);
