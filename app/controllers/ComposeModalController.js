angular.module('Pelican')

.controller('ComposeModalController', ['$scope', '$rootScope', 'apiService', 'validator',
  function ($scope, $rootScope, apiService, validator) {

  $scope.isListModalOpen = false;

  $rootScope.$on('open compose modal', function (e, data) {
    $scope.isListModalOpen = true;
  });

  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
    $scope.activeList = null;
    $scope.listTitle = "";
    $scope.newPost = {};
  };

  $scope.addList = function (listTitle) {
    if (!listTitle) return alertify.error('Please add a list title to create one.');

    apiService.addList(listTitle)
    .then(function (response) {
      alertify.success('New list created!')
      // $scope.activateList(response.data);
      response.data.fromNewList = true;
      $scope.activateList(response.data);
      $rootScope.$emit('new list created', response.data);
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
      response.data.owner = $scope.user;
      if ($scope.activeList.fromNewList) response.data.fromNewList = true;
      $rootScope.$emit('new post created', response.data);

      $scope.closeListModal();
      alertify.success('New post created!')
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your post :(')
    })
  }

}]);
