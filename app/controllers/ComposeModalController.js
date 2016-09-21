angular.module('Pelican')

.controller('ComposeModalController', ['$scope', '$rootScope', 'apiService', 'validator',
  function ($scope, $rootScope, apiService, validator) {

  $scope.isListModalOpen = false;

  $rootScope.$on('open compose modal', function (e, data) {
    $scope.isListModalOpen = true;
    if (data.activeList) $scope.activeList = data.activeList;
  });

  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
    $scope.activeList = null;
    $scope.newList = null;
    $scope.newPost = {};
    $scope.query = "";
  };

  $scope.backToList = function () {
    $scope.activeList = null;
  };

  $scope.newList = {
    title: 'test title',
    isPrivate: true
  }

  $scope.addList = function (list) {
    if (!list.title) return alertify.error('Please add a list title to create one.');
    if (!list.isPrivate) list.isPrivate = false;

    apiService.addList(list.title, list.isPrivate)
    .then(function (response) {
      alertify.success('New list created!')
      // $scope.activateList(response.data);
      response.data.fromNewList = true;
      $scope.activateList(response.data);
      $rootScope.$emit('new list created', response.data);
      $scope.newList = null;
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
    if (newPost.link) {
      try {
        newPost.link = validator.verifyLink(newPost.link)
      } catch (err) {
        return alertify.error(err);
      }
    }

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
  };

  $scope.$watch('newPost.link', function(newVal, oldVal) {
    if (!newVal || $scope.newPost.title) return;
    try { var uri = validator.verifyLink(newVal) } catch (err) { return; }

    apiService.getHeader(uri)
    .then(function (response) {
      if (response.data) $scope.newPost.title = response.data;
    })
    .catch(function (err) {
      console.warn(err);
    });
  });

}]);
