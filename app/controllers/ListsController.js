angular.module('Pelican')

.controller('ListsController', ['$scope', 'apiService', 'validator', '$rootScope', function ($scope, apiService, validator, $rootScope) {

  //INIT
  $scope.init = function (user, lists) {
    if (user) $scope.user = user;
    if (lists) $scope.lists = lists
  };

  $scope.openPost = function (post, postIndex, listIndex) {
    $scope.activePost = post;
    $scope.activePost.postIndex = postIndex;
    $scope.activePost.listIndex = listIndex;
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
  };

  $scope.toggleListLock = function (list) {
    apiService.toggleListPrivate(list)
    .then(function (response) {
      list.isPrivate = !list.isPrivate;
      $rootScope.$emit('list privacy toggled', list)
    })
    .catch(function (err) {
      console.error(err);
      alertify.error("There was a problem with changing your list settings.")
    })
  };

  // EDIT POST
  $scope.turnOffEditPost = function () {
    $scope.editingPost = false;
  };

  $scope.turnOnEditPost = function () {
    $scope.editablePost = angular.copy($scope.activePost);
    $scope.editingPost = true;
  };

  $scope.deletePost = function (post) {
    alertify.confirm("Are you sure you want to delete this post? This action cannot be undone.", function () {
      apiService.deletePost(post)
      .then(function (response) {
        alertify.success('The post has been deleted.');
        console.warn(response);
      })
      .catch(function (err) {
        console.error(err);
        alertify.error('There was a problem with deleting your post.');
      })
    });
  };

  $scope.updatePost = function (post) {
    apiService.updatePost(post)
    .then(function (response) {
      $scope.activePost = response.data;
      $scope.editingPost = false;

      $rootScope.$emit('post edited', $scope.activePost);
      $scope.lists[$scope.activePost.listIndex].posts[$scope.activePost.postIndex] = response.data;

      socket.emit('updated post', 'hello world!');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

  $scope.openComposeModal = function () {
    $rootScope.$emit('open compose modal', {
      user: $scope.user,
      lists: $scope.lists
    })
  };

  $rootScope.$on('new post created', function (e, newPost) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === newPost.parentList) list.posts.unshift(newPost);
      return list;
    });
  });

}]);
