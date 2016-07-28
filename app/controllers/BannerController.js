angular.module('Pelican')

.controller('BannerController', ['$scope', 'apiService', 'validator', function ($scope, apiService, validator) {

  //INIT
  $scope.init = function (user, lists, posts) {
    if (user)   $scope.user   = user;
    if (lists)  $scope.lists  = lists;
    if (window.location.pathname.indexOf('/user') > -1) {
      $scope.userPage = true;
    } else {
      $scope.userPage = false;
    }
  };

  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
    $scope.activeList = null;
  };

  $scope.addList = function (listTitle) {
    if (!listTitle) return alertify.error('Please add a list title to create one.');

    apiService.addList(listTitle)
    .then(function (response) {
      alertify.success('New list created!')
      $scope.activateList(response.data);
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your new list :(')
    })
  };

  $scope.activateList = function (list) {
    $scope.activeList = list;
  };

  $scope.addPost = function (newPost) {
    try { validator.validateNewPost($scope.activeList, newPost) } catch (err) { return alertify.error(err); }

    apiService.addPost(newPost, $scope.activeList)
    .then(function (response) {
      console.info(response);
      alertify.success('New post created!')
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your post :(')
    })
  }

}]);
