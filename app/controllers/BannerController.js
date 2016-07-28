angular.module('Pelican')

.controller('BannerController', ['$scope', 'apiService', 'validator', function ($scope, apiService, validator) {

  //INIT
  $scope.init = function (user, lists) {
    console.log(arguments);
    if (user) $scope.user = user;
    console.log($scope.user);
  };

  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
  };

  $scope.addList = function (listTitle) {
    if (!listTitle) return alertify.error('Please add a list title to create one.');

    apiService.addList(listTitle)
    .then(function (response) {
      alertify.success('New list created!')
      $scope.displayPostInput = true;
      $scope.activeList = response.data;
      console.info(response);
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your new list :(')
    })
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
