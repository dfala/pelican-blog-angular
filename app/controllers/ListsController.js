angular.module('Pelican')

.controller('ListsController', ['$scope', 'apiService', 'validator', function ($scope, apiService, validator) {

  //INIT
  $scope.init = function (user, lists) {
    if (user) $scope.user = user;
    if (lists) $scope.lists = lists
  };

  $scope.openPost = function (post) {
    $scope.activePost = post;
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
      console.warn(response);
      $scope.activePost = response.data;
      $scope.editingPost = false;

      socket.emit('updated post', 'hello world!');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

}]);
