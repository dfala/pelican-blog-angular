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

  // EDIT POST
  $scope.turnOffEditPost = function () {
    $scope.editingPost = false;
  };

  $scope.turnOnEditPost = function () {
    $scope.editablePost = angular.copy($scope.activePost);
    $scope.editingPost = true;
  };

  $scope.updatePost = function (post) {
    apiService.updatePost(post)
    .then(function (response) {
      $scope.activePost = response.data;
      $scope.editingPost = false;

      $rootScope.$broadcast('post edited', $scope.activePost);
      $scope.lists[$scope.activePost.listIndex].posts[$scope.activePost.postIndex] = response.data;

      socket.emit('updated post', 'hello world!');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

}]);
